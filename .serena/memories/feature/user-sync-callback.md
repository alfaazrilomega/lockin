# User Sync Implementation Plan

## Context

**Problem**: When new users sign up, they create a Supabase Auth account, but NO corresponding `User` record is created in the Prisma database. This causes `requireUser()` to throw "User account not found in database" when they try to access the dashboard.

**Root Cause**: The auth callback route (`app/api/auth/callback/route.ts`) only exchanges the code for a session and redirects. It never creates the local `User` record.

**Impact**: Sign-up flow is completely broken. New users cannot use the application after verifying their email.

---

## Current Sign-up Flow

```
1. User fills sign-up form → useAuth().signUp()
2. Supabase creates auth user + sends verification email
3. User clicks verification link → goes to /api/auth/callback?code=...
4. Callback exchanges code for session
5. Callback redirects to /dashboard
6. DashboardLayout calls requireUser()
7. requireUser() checks if User exists in DB → ❌ NOT FOUND → ERROR
```

---

## Proposed Solution

Enhance the callback route to **synchronize** Supabase users to the local `User` table:

### Step 1: Import Prisma & Create User Sync Logic

```typescript
import { prisma } from '@/lib/prisma'  // Add to callback route
```

### Step 2: After Exchanging Code, Get Session User

```typescript
const { data: { session } } = await supabase.auth.getSession()
if (!session?.user) {
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
```

### Step 3: Upsert User Record

```typescript
const supabaseUser = session.user
const userId = supabaseUser.id

// Upsert: create if not exists, update if exists (email/name might change)
await prisma.user.upsert({
  where: { id: userId },
  update: {
    // Update mutable fields (in case user updated profile in Supabase)
    email: supabaseUser.email ?? '',
    name: supabaseUser.user_metadata?.full_name ?? 
          supabaseUser.email?.split('@')[0] ?? 
          'User',
    avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
    updatedAt: new Date(),
  },
  create: {
    id: userId,
    email: supabaseUser.email ?? '',
    name: supabaseUser.user_metadata?.full_name ?? 
          supabaseUser.email?.split('@')[0] ?? 
          'User',
    avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
    createdAt: new Date(supabaseUser.created_at || new Date()),
    updatedAt: new Date(),
  },
})
```

### Step 4: Redirect to Dashboard (as before)

No change - keep existing redirect logic.

---

## Full Updated Callback Route Structure

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'  // NEW

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { /* existing */ } }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // NEW: Sync user to local DB
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const user = session.user
        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            email: user.email ?? '',
            name: user.user_metadata?.full_name ??
                  user.email?.split('@')[0] ??
                  'User',
            avatarUrl: user.user_metadata?.avatar_url ?? null,
            updatedAt: new Date(),
          },
          create: {
            id: user.id,
            email: user.email ?? '',
            name: user.user_metadata?.full_name ??
                  user.email?.split('@')[0] ??
                  'User',
            avatarUrl: user.user_metadata?.avatar_url ?? null,
            createdAt: new Date(user.created_at || new Date()),
            updatedAt: new Date(),
          },
        })
      }
      
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
```

---

## Why Upsert Instead of Create Only?

1. **Email change**: User might change email in Supabase later → sync updates our DB
2. **Profile updates**: User updates name/avatar → sync updates
3. **Idempotent**: If callback runs twice (rare), won't throw unique constraint error
4. **Safe for migrations**: Existing users won't break

---

## Test Cases to Verify

After implementation:

- [ ] **New sign-up**: Register → verify email → redirect to dashboard → **NO error**
- [ ] **Existing user**: Sign out → sign in → should still work (upsert updates)
- [ ] **Profile update**: Change name in Supabase dashboard → sign in → check DB reflects change
- [ ] **Email change**: Change email in Supabase → sign in → DB email updates
- [ ] **Session persists**: After sign-up, user stays logged in (cookies set correctly)
- [ ] `requireUser()` passes for both new and existing users

---

## Alternative: Database Trigger (Not Recommended)

Could use PostgreSQL trigger on Supabase `audit` table, but:
- More complex to set up
- Requires Supabase SQL editor
- Harder to debug
- Less portable

**Stick with application-level sync** in callback.

---

## Additional Considerations

### 1. Email Verification

Currently, callback runs even if email not verified? Check:
```typescript
if (!session?.user?.email_confirmed_at) {
  // Maybe redirect to verify-email page instead
}
```

But the flow already requires clicking verification link to get the code, so session should be verified.

### 2. Deleted Users

If user is deleted in Supabase but still has local record:
- Next sign-up would recreate? But UID would be different.
- Not an issue - don't overcomplicate.

### 3. Error Handling

If `prisma.user.upsert` fails (DB connection, etc.):
- Should we fail the auth flow? Probably yes - user can't proceed anyway
- But error might be confusing ("Your account was created but...")
- Consider retry or fallback?

Current error handling: catches unhandled errors → Next.js error page. Acceptable for now.

### 4. Performance

`prisma.user.upsert` is fast (single row). No need for batching.

---

## Implementation Steps

1. **Add Prisma import** to `app/api/auth/callback/route.ts`
2. **Get session user** after `exchangeCodeForSession`
3. **Add upsert logic** with proper field mapping
4. **Test locally** with a new sign-up
5. **Check TypeScript errors** (should be none if types align)
6. **Run lint** to ensure no unused imports

---

## Post-Implementation Checklist

- [ ] Type check: `npx tsc --noEmit` ✅
- [ ] Lint: `npm run lint` ✅
- [ ] Manual test: Full sign-up flow works end-to-end ✅
- [ ] Database: `User` record created with correct `id`, `email`, `name` ✅
- [ ] Dashboard loads without "User account not found" error ✅
- [ ] Existing sign-in still works unaffected ✅

---

## Future Improvements

- **Webhook Alternative**: Set up Supabase webhook (`user.created`) → `/api/webhooks/supabase` → more real-time, works for admin-created users too.
- **Profile Sync**: Add periodic cron job to sync profile changes from Supabase (if users can edit profile outside app).
- **Soft Delete**: If user deletes account in Supabase, mark `User.deletedAt` instead of hard delete.
- **Audit Log**: Log when user records are created/updated for debugging.

---

## Security Considerations

- ✅ No SQL injection (Prisma ORM)
- ✅ User ID from trusted Supabase session (not client-provided)
- ✅ No sensitive data exposed in logs (avoid logging full session)
- ✅ Upsert prevents duplicate key violations
- ✅ Server-side only (no client exposure)

---

## Affected Files

- **Primary**: `app/api/auth/callback/route.ts` (needs modification)
- **Secondary**: `lib/auth-helpers.ts` (no change, but its `requireUser` will now succeed)
- **Tests**: None exist - consider adding e2e test with Playwright

---

## Estimated Effort

- **Implementation**: 10-15 minutes
- **Testing**: 10 minutes
- **Type check + lint**: 5 minutes

**Total**: ~30 minutes

---

## Recommendation

**PRIORITY: HIGH** - This is a blocker for any new user registration. Without it, the entire application is unusable for new sign-ups.

Implement immediately before any testing with new users.
