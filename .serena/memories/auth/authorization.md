# Authentication & Authorization Guide

## Overview

LockIn uses **Supabase Auth** for authentication and custom authorization logic for resource access control.

### Key Concepts

1. **Authentication** = Who is the user? (via Supabase)
2. **Authorization** = What can the user do? (via custom helpers)

---

## Authentication Flow

### 1. User Login/Signup

- `/auth/sign-in` page uses Supabase Auth UI or custom form
- On successful auth, Supabase sets session cookie (`sb:...`)
- `proxy.ts` middleware runs on every request to protected routes

### 2. Middleware Protection (`proxy.ts`)

```typescript
// For /dashboard/* routes:
- If NO user session → redirect to /auth/sign-in?redirect=...
- If user HAS session AND on /auth/* (not callback) → redirect to /dashboard
```

**Matcher**: `'/((?!_next/static|_next/image|favicon.ico|public).*)'`
- Skips static assets, images, favicon, public folder

### 3. Server-Side Client Creation

Two flavors:

```typescript
// For server components/actions:
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

// For client components:
import { createClientComponentClient } from '@/lib/supabase/client'
const supabase = createClientComponentClient()
const { data: { user } } = await supabase.auth.getUser()
```

---

## Authorization System

### Resource Ownership Model

- **User**: `id` (from Supabase UID), `email`, `name`, `avatarUrl`
- **Project**: Has `ownerId` (User.id). Members via `ProjectMember` join table.
- **Task**: Belongs to a `Project` (via `projectId`). Assigned to `assigneeId` (User.id optional).
- **Note**: Has `authorId` (User.id). Optional `projectId`.
- **FlashcardDeck**: Has `authorId` (User.id). Optional `noteId`.
- **Flashcard**: Belongs to a `Deck`.

### Permission Levels (`PermissionLevel` enum)

```typescript
enum PermissionLevel {
  LEADER   // Full control, can manage members
  EDITOR   // Can edit content but not manage members
  VIEWER   // Read-only
}
```

Stored in `ProjectMember.permission`.

---

## Authorization Helpers (lib/auth-helpers.ts)

All helpers are async. They throw on failure (except `isProjectMember` returns boolean).

### Authentication

#### `requireUser(): Promise<AuthUser>`
Throws if:
- No session cookie
- User not in Supabase
- User not in our `User` table (sync required)

Returns:
```typescript
{
  ...supabaseUser,  // id, email, user_metadata, etc.
  dbUser: { id, name, email, avatarUrl, createdAt, updatedAt }
}
```

**Usage**: First call in every protected server action.

### Project Access

#### `isProjectMember(projectId, userId): Promise<boolean>`
Returns `true` if user is owner or has a `ProjectMember` record.
Does NOT throw - safe for conditional checks.

#### `authorizeProjectModify(projectId, userId)`
Throws if user is NOT authorized to modify project.
Authorization: user is owner OR member with `LEADER` or `EDITOR` permission.
(NOTE: Current implementation checks membership only, not permission level - potential bug?)

### Task Access

#### `authorizeTaskModify(taskId, userId)`
Checks that user is a member of the task's project (via `isProjectMember`).
Does NOT check task assignee - anyone on project can modify? Possibly intended.

#### `authorizeTaskAccess(taskId, userId)`
Intended for read access? Implementation may be same as modify. Verify.

### Note Access

#### `authorizeNoteModify(noteId, userId)`
Checks that `note.authorId === userId`.

#### `authorizeNoteAccess(noteId, userId)`
Similar? Might allow project member read access? Check implementation.

### Flashcard Access

#### `authorizeDeckModify(deckId, userId)`
Checks that `deck.authorId === userId`.

---

## Usage Pattern in Server Actions

```typescript
export async function updateTask(taskId: string, data: UpdateTaskForm) {
  try {
    // 1. Authenticate
    const { user } = await requireUser()

    // 2. Authorize - throws if not allowed
    await authorizeTaskModify(taskId, user.id)

    // 3. Perform update
    const task = await prisma.task.update({ ... })
    revalidatePath('/dashboard')
    return { success: true, data: toTaskDTO(task) }
  } catch (error) {
    // Handle error (including auth errors)
    return { success: false, error: error.message }
  }
}
```

---

## Important Notes & Potential Issues

### 1. Permission Level Not Checked

`authorizeProjectModify` likely calls `isProjectMember` which only checks membership, **not** `PermissionLevel`. This means VIEWER could potentially modify?

**Action**: Review `lib/auth-helpers.ts` implementation. Should check:
```typescript
if (member.permission === 'LEADER' || member.permission === 'EDITOR') {
  return // authorized
}
throw new Error('Insufficient permissions')
```

### 2. Project Owner as Member?

When a user creates a project, is a `ProjectMember` record also created for the owner?
If `isProjectMember` only checks `ProjectMember` table (not `Project.ownerId`), owners might be locked out!

**Action**: Verify implementation. Likely needs:
```typescript
const project = await prisma.project.findUnique({ where: { id } })
if (project.ownerId === userId) return true // owner always member
// else check ProjectMember
```

### 3. Task Modification Authorization

`authorizeTaskModify` checks project membership, not task-specific assignee.
This is okay if:
- Any project member can edit any task (collaborative)
But if tasks are siloed by assignee, need additional check:
```typescript
if (task.assigneeId !== userId && !isProjectLeader(userId, projectId)) {
  throw new Error('Cannot edit task assigned to others')
}
```

### 4. Note Access

`authorizeNoteModify` only checks `note.authorId`. What about project members who want to collaborate on a note within a project?
Consider:
- Notes within a project should be editable by project members?
- Or keep notes strictly owned by author?

**Current**: Strict author-only modification.

### 5. Missing Authorization on Some Actions

Review each server action:
- `getUserNotes(userId)` - only fetches own notes? Check authorization.
- `getUserDecks(userId)` - restricts to own decks (good).
- `getNoteById` uses `authorizeNoteAccess` (good).
- `getProjectNotes` - does it authorize? Should check project membership.

---

## User Sync

**Critical**: When a user signs up, you must create a corresponding `User` record in our DB with:
- `id` = Supabase user ID (NOT a new UUID)
- `email`, `name`, `avatarUrl` from Supabase `user_metadata`

**Where is this done?** Likely missing! Check `app/api/auth/callback/route.ts` (if exists) or sign-up flow.

If not implemented, users will get "User account not found in database" after sign-up.

**Fix**: Implement an auth callback route or sign-up webhook to create `User` upon first login.

---

## Future Considerations

1. **Role-Based Access Control (RBAC)**: Implement proper permission checks using `ProjectMember.permission`.
2. **Row Level Security (RLS)**: Supabase has RLS - could offload some checks to DB layer, but Prisma bypasses RLS. Need to decide.
3. **Session Management**: Implement session timeout, refresh logic. Supabase handles refresh automatically but consider custom logic.
4. **OAuth Providers**: Supabase supports Google, GitHub, etc. Ensure `user_metadata` maps correctly.
5. **Multi-tenancy**: Currently single-tenant per user. If adding org-level isolation, need to update queries.

---

## Testing Authorization

Create integration tests:

```typescript
// Scenario 1: Project owner can add members
// Scenario 2: Non-member cannot modify project
// Scenario 3: VIEWER cannot edit tasks
// Scenario 4: Task assignee can update their task
// Scenario 5: Note author only can edit
// Scenario 6: Flashcard deck author only can modify
```

Use test fixtures with known users and projects.

---

## Security Checklist

- [x] All mutations call `requireUser()`
- [x] All mutations call appropriate `authorize*` helper
- [ ] Verify `authorizeProjectModify` checks permission level (not just membership)
- [ ] Ensure project owners are recognized (check ownerId in addition to ProjectMember)
- [ ] Implement user sync on sign-up (create User record)
- [ ] Add rate limiting on sensitive actions
- [ ] Audit logs? (who changed what and when)
- [ ] Validate that deleted cascades are correct (`onDelete: Cascade` in schema)
- [ ] Consider soft deletes for important data (use `deletedAt` timestamp)

---

## Reference: Database Schema Authorization Fields

```prisma
model User {
  id        String   @id
  email     String   @unique
  name      String
  // ...
  ownedProjects Project[]        @relation("ProjectOwner")
  memberships   ProjectMember[]
  tasks         Task[]           @relation("AssignedTasks")
  notes         Note[]
  flashcards    FlashcardDeck[]
}

model Project {
  id          String           @id
  ownerId     String           @map("owner_id")
  owner       User             @relation("ProjectOwner", fields: [ownerId], references: [id])
  members     ProjectMember[]
  // ...
}

model ProjectMember {
  userId     String
  projectId  String
  roleName   String
  permission PermissionLevel  // LEADER / EDITOR / VIEWER
  // ...
}
```

---

## Common Errors

### "Unauthorized: No user session found"
- User not logged in or session expired.
- Redirect to sign-in.

### "Unauthorized: User account not found in database"
- User exists in Supabase but no `User` record.
- Likely missing sign-up callback. Create `User` record.

### "Unauthorized: Cannot access this resource"
- Authorization check failed.
- Verify user's membership/role for the resource.
- Check `ProjectMember.permission` if role matters.

---

## Debugging Tips

1. **Log user ID and resource IDs** in server actions to verify:
```typescript
console.log('User:', user.id, 'Project:', projectId, 'Member?', await isProjectMember(...))
```

2. **Check Supabase session**:
```typescript
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)
```

3. **Inspect DB directly** with Prisma Studio:
```bash
npx prisma studio
```
Check `ProjectMember` table for user's membership records.

4. **Enable Prisma logging** in `lib/prisma.ts`:
```typescript
log: ['query', 'info', 'warn', 'error']
```
See which queries are executed during authorization checks.
