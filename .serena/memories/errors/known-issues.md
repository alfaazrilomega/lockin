# Common Pitfalls & Known Issues

## Critical: CRLF Line Endings on Windows

**Problem**: TypeScript parser fails with cryptic errors when files have Windows CRLF (`\r\n`) line endings.

**Symptoms**:
```
error TS1137: Expression or comma expected
error TS1128: Declaration or statement expected
```
Even though code looks syntactically correct.

**Root Cause**: TypeScript parser on Windows sometimes misinterprets CRLF as part of the token stream, breaking tokenization.

**Affected File** (confirmed):
- `lib/actions/dashboard.actions.ts` - has CRLF, needs conversion

**Detection**:
```bash
# Check if file has CRLF
file lib/actions/dashboard.actions.ts
# Output: "with CRLF line terminators"

# Or use cat -A
cat -A lib/actions/dashboard.actions.ts | head -1
# Look for ^M$ at end of lines
```

**Fix**:
1. In VS Code: Open file → bottom-right "CRLF" → click → select "LF" → Save
2. Batch conversion (Git Bash/WSL):
   ```bash
   find . -name "*.ts" -o -name "*.tsx" | xargs -I {} sh -c 'dos2unix {}'
   ```
3. Prevent future: Set Git `core.autocrlf`:
   ```bash
   git config --global core.autocrlf input  # Store LF, checkout as-is
   # OR add .gitattributes with: * text=auto
   ```

---

## TypeScript Errors from Lint

### 1. `Unexpected any. Specify a different type`

**Locations**:
- `lib/actions/dashboard.actions.ts:11` & `20` - `toProjectDTO(project: any)`
- `lib/actions/task.actions.ts:12` - `toTaskDTO(task: any)`
- `lib/actions/project.actions.ts:12` & `22` - `toProjectDTO` & `_count` access
- `lib/actions/note.actions.ts:12` - `toNoteDTO(note: any)`
- `lib/actions/flashcard.actions.ts:11` & `20` - `toFlashcardDeckDTO` & `toFlashcardDTO`
- `lib/prisma.ts:14` - `pool as any`

**Why it happens**: Quick helper functions use `any` to bypass TypeScript's strict typing when accessing Prisma model fields that have snake_case names but TypeScript interface expects camelCase.

**Impact**: These are not runtime errors but lint violations. Code works but violates strict type safety.

**Fix Strategy**:
```typescript
// Option 1: Use Prisma's type-safe select/expand
function toProjectDTO(
  project: Prisma.ProjectGetPayload<{
    include: { owner: true; members: true; tasks: true; notes: true }
  }>
): Project {
  return {
    ...project,
    createdAt: project.created_at,  // safe: Prisma type includes _count
    updatedAt: project.updated_at,
    ownerId: project.owner_id,
    _count: project._count,  // type-safe!
  }
}

// Option 2: Define intermediate interface
interface ProjectDB {
  id: string
  created_at: Date
  updated_at: Date
  owner_id: string
  // ... all snake_case fields
}
function toProjectDTO(project: ProjectDB): Project { ... }
```

**Current**: Accept `any` temporarily but plan to refactor with proper Prisma types.

---

### 2. Unused Imports

**Examples**:
- `lib/actions/note.actions.ts`: `createClient` imported but not used
- `lib/actions/project.actions.ts`: `createClient` unused
- `lib/actions/task.actions.ts`: `createClient` unused
- `lib/actions/ai.actions.ts`: `AISummaryRequest` interface unused
- `app/(dashboard)/overview/page.tsx`: `Users`, `CheckCircle`, `format` unused

**Fix**: Remove unused imports. ESLint auto-fix (`npx eslint . --fix`) may catch some.

---

### 3. React Hook Dependency Warnings

**`components/layout/Preloader.tsx:166`**:
> The ref value 'timersRef.current' will likely have changed by the time this effect cleanup function runs.

**Issue**: Effect cleanup uses `timersRef.current` directly, but ref may have changed between effect run and cleanup.

**Fix**: Capture ref value in a local variable inside effect:
```typescript
useEffect(() => {
  const current = timersRef.current
  // use 'current' in cleanup
  return () => { clearTimeout(current) }
}, [])
```

---

### 4. `<img>` instead of `next/image`

**`components/ui/avatar-circles.tsx:20`**:
> Using `<img>` could result in slower LCP.

**Fix**: Replace `<img src="..." />` with:
```typescript
import Image from 'next/image'
<Image src="..." alt="..." width={40} height={40} />
```
(Requires image optimization config if external URLs)

---

### 5. Unused Config in `useToast`

**`components/ui/use-toast.tsx:5`**: `cn` imported but not used. Remove or use it.

---

## Build/Install Issues

### 1. Missing API Keys

**Error**: `OPENROUTER_API_KEY` is required.

**Fix**: Create `.env` file with:
```env
OPENROUTER_API_KEY=your-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'` or `PrismaClient is not a constructor`.

**Fix**:
```bash
npx prisma generate
```

### 3. Database Connection Failed

**Error**: `P1001: Can't reach database server`.

**Check**:
- `DATABASE_URL` is correct
- Supabase project is running (if local: `supabase start`)
- Network/firewall allows connection

---

## Runtime Errors to Watch For

### 1. "User account not found in database"

**Cause**: User authenticated with Supabase but no corresponding `User` record in Prisma DB.

**Fix**: Ensure user sync happens on sign-up (missing implementation?) or create user manually in DB.

### 2. "Unauthorized: Cannot access this resource"

**Cause**: Authorization check failed (`authorize*` helper threw).

**Common scenario**: User is member but trying to modify another user's resource.

**Debug**: Check that the logged-in user's ID matches the resource owner or has proper role.

### 3. "Invalid status value"

**Cause**: Task status enum mismatch. Only `TODO|IN_PROGRESS|REVIEW|REVISION|DONE` allowed.

**Fix**: Ensure client sends exactly one of these string literals (not enum values if using TypeScript enums differently).

### 4. "Failed to fetch" on AI calls

**Causes**:
- `OPENROUTER_API_KEY` missing or invalid
- OpenRouter API rate limited or down
- Network error

**Check**: Server logs, OpenRouter dashboard.

---

## Silent Failures (Warnings)

### 1. Console Warnings in Dev

Look for:
- React strict mode double-mount warnings (should be expected in dev)
- Next.js hydration mismatches (check `suppressHydrationWarning` usage)
- Image optimization warnings (external URLs without `remotePatterns` in `next.config.ts`)

### 2. Zod Validation Not Enforced?

**Risk**: If server action doesn't call `.parse()`, validation skipped.

**Always**:
```typescript
const validation = schema.parse(data)  // Throws on invalid
// NOT schema.parseAsync() twice-check, just once
```

### 3. Missing Revalidation

**Symptom**: UI doesn't update after mutation until page refresh.

**Cause**: Forgetting `revalidatePath()`.

**Fix**: Add after successful DB operation, before return.

---

## Performance Anti-Patterns

1. **Large responses**: Server actions returning massive `include:` trees. Paginate or select only needed fields.
2. **N+1 queries**: Using `findMany` without proper `include` leads to N+1. Prisma handles this automatically with `include` - but watch for deeply nested includes.
3. **Client-side filtering**: If you fetch all tasks then filter in component, you're sending too much data. Filter at DB level.
4. **Missing keys**: Lists without `key` prop cause React warnings (use `id` from DB).
5. **No loading states**: Async server actions without `useTransition` cause UI freeze. Consider `startTransition` for non-urgent updates.

---

## Security Checklist

- [x] Authorization on all mutations (checked)
- [x] Zod validation (generally present)
- [ ] Rate limiting on AI endpoint (missing - abuse possible)
- [ ] File upload size limits (if allowing uploads, not just URLs)
- [ ] CORS properly configured (Next.js default OK)
- [ ] Secrets only in `.env` (never in client code)
- [ ] SQL injection safe (using Prisma ORM - good)
- [ ] XSS: Slate.js should sanitize - verify configuration

---

## Database Migrations

**Never edit `prisma/schema.prisma` without testing**:
1. Make changes
2. Run `npx prisma generate`
3. Run `npx prisma db push` (dev) or `npx prisma migrate dev`
4. Test locally
5. Commit **both** schema and migration files

**Common DB Errors**:
- Relation field mismatch: Ensure FK names match `@map` definitions
- Enum values: Must match exactly the Prisma enum names
- `@default(uuid())` on User.id = WRONG. User.id comes from Supabase.

---

## Environment-Specific Issues

### Development
- Use local Supabase (`supabase start`) or remote dev project
- Keep `.env.local` for secrets (excluded from git)
- `NEXT_PUBLIC_*` vars exposed to client, others server-only

### Production (Vercel)
- Set all env vars in Vercel dashboard
- Build runs `npm run build` - ensure `npx prisma generate` runs (prisma/vscode extension helps)
- `DATABASE_URL` must be production Supabase connection
- Consider connection pooling (use `pgbouncer` in Supabase)

---

## Debugging Tips

1. **Server action not running?** Check client component has `"use client"` if calling from client. Server components can call server actions directly.
2. **Authorization failing?** Log `user.id` and resource `ownerId`/`members` to debug membership.
3. **Prisma query error?** Enable Prisma logging: `log: ['query']` in `lib/prisma.ts`.
4. **AI endpoint 500?** Check OpenRouter API key and quotas.
5. **TypeScript parse errors?** Check line endings (CRLF).

---

# Future Improvements

- [ ] Add `.gitattributes` to enforce LF
- [ ] Replace all `any` in DTO helpers with proper Prisma types
- [ ] Add ESLint rule to enforce `satisfies` operator for better type inference
- [ ] Implement rate limiting on `/api/ai`
- [ ] Add error tracking (Sentry)
- [ ] Write unit tests for server actions
- [ ] Add health check endpoint (`/api/health`)
- [ ] Configure image remote patterns for external AI-generated images
