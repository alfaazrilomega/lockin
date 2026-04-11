# Code Style & Conventions Guide

## Core Philosophy

- **Server Components First**: Assume every component is a server component. Only add `"use client"` when you need React state, effects, or browser APIs.
- **Server Actions for Mutations**: Never call Prisma directly from client components. All DB writes go through server actions in `lib/actions/`.
- **TypeScript Strict**: No `any` types. Use proper interfaces from `lib/types.ts` or Prisma generated types.
- **Error Boundaries**: Server actions catch errors and return structured responses; UI components handle these gracefully.

## File Organization

### Page Files (`app/*/page.tsx`)
- Server components by default
- Fetch data directly with server actions or Prisma
- Pass data to client components as props
- Use `async/await` for data fetching

### Layout Files (`app/*/layout.tsx`)
- Root layout: `app/layout.tsx` includes ThemeProvider, Preloader, fonts
- Dashboard layout: `app/(dashboard)/layout.tsx` includes Sidebar & TopNav
- Route groups `(dashboard)` keep authenticated routes together

### Components (`components/`)

#### UI Components (`components/ui/`)
- Shadcn UI pre-built components (Button, Card, Dialog, etc.)
- Keep them unstyled or with minimal base styles
- Compose in composite components

#### Layout Components (`components/layout/`)
- Sidebar, TopNav, Preloader
- May be client components if interactive

#### Shared Components (`components/shared/`)
- Composite UI: `new-project-dialog.tsx`, `new-task-dialog.tsx`, etc.
- Combine UI components + business logic
- Often client components with `"use client"`

#### Feature Components (`components/notes/`, etc.)
- Domain-specific components
- Follow naming: `note-details-client.tsx` explicitly marks client usage

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `NewNoteDialog.tsx` |
| Function/Variable | camelCase | `createProject`, `userId` |
| Type/Interface/Enum | PascalCase | `Project`, `TaskStatus`, `CreateTaskForm` |
| File (non-component) | kebab-case | `prisma-client.ts`, `use-toast.ts` |
| Constant | UPPER_SNAKE_CASE | `NEXT_PUBLIC_SUPABASE_URL` |
| Database field | snake_case | `owner_id`, `created_at` (via `@map`) |

## TypeScript Rules

### Strict Mode Enabled
- No implicit `any`
- No `unknown` without type assertion or narrowing
- Function return types should be explicit
- Props interfaces required (use `type` or `interface`)

### Prefer Types over Interfaces
```typescript
// Good
type User = { id: string; email: string }
type ProjectMember = { userId: string; role: PermissionLevel }

// Also acceptable
interface User { id: string; email: string }
```

### Use TypeScript 5.0 Features

- `const` assertions: `as const`
- `satisfies` operator (when helpful)
- Template literal types (if needed)

### Avoid `any` at All Costs

**Anti-pattern (current code)**:
```typescript
function toProjectDTO(project: any): Project { ... }
```

**Better**:
```typescript
import { Prisma } from '@prisma/client'
function toProjectDTO(project: Prisma.ProjectGetPayload<{ include: {} }>): Project { ... }
```
Or use `Select` types from Prisma for precise typing.

## Database Access Pattern

### Prisma Client Singleton

`lib/prisma.ts` exports a singleton `prisma` instance:
```typescript
export const prisma = globalThis.prisma ?? new PrismaClient({...})
```

### Use in Server Actions Only

Server actions import `prisma` directly:
```typescript
import { prisma } from '@/lib/prisma'

const project = await prisma.project.findUnique({
  where: { id },
  include: { owner: true, members: true }
})
```

### Never Use Prisma in Client Components

- Client components cannot directly access DB
- Use server actions as the bridge
- Server actions can be imported into client components (they have `"use server"` directive)

## Validation with Zod

All server actions must validate inputs:

```typescript
import { createProjectSchema } from '@/lib/validations'

export async function createProject(data: CreateProjectForm) {
  const validation = createProjectSchema.parse(data)
  // validation now typed and validated
}
```

Schemas should:
- Define min/max lengths
- Mark optional fields with `.optional()`
- Handle nulls with `.nullable()`
- Transform data (e.g., date strings → Date objects) with `.transform()`
- Trim strings with `.trim()` to remove whitespace

## Authorization Pattern

Every mutation action must authorize the user:

```typescript
const { user } = await requireUser()  // Throws if not logged in
await authorizeProjectModify(projectId, user.id)  // Throws if not member/owner
```

Authorization helpers are in `lib/auth-helpers.ts`:

- `requireUser()` - ensures authenticated user exists in DB
- `isProjectMember(projectId, userId)` - returns boolean (for reads)
- `authorizeProjectModify(projectId, userId)` - throws if not authorized
- `authorizeTaskModify(taskId, userId)`
- `authorizeNoteModify(noteId, userId)`
- `authorizeDeckModify(deckId, userId)`
- `authorizeTaskAccess(taskId, userId)` - for reading tasks
- `authorizeNoteAccess(noteId, userId)` - for reading notes

**Pattern**: Use the `authorize*` variant that matches the permission level needed.

## Error Handling in Server Actions

```typescript
export async function someAction(...): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    // ... business logic
    return { success: true, data: result }
  } catch (error) {
    console.error('Action name error:', error)  // For debugging
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Invalid input' }
    }
    
    if (error instanceof Error) {
      // For auth errors thrown by requireUser/authorize*, bubble up message
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'Unknown error occurred' }
  }
}
```

## Revalidation

After any successful mutation, call `revalidatePath()` to refresh Next.js cache:

```typescript
import { revalidatePath } from 'next/cache'

revalidatePath('/dashboard')  // Refresh home
revalidatePath(`/dashboard/projects/${projectId}`)  // Refresh project page
```

Use specific paths, not wildcards. Call **after** the DB operation succeeds.

## UI/UX Conventions

- Use shadcn UI components (`@/components/ui/*`)
- Never use HTML `<button>` or `<input>` directly unless custom
- Use `cn()` utility for conditional classes: `cn("base", condition && "conditional")`
- Dark mode ready: Use `text-foreground`, `bg-background` tokens from CSS variables
- Responsive: Use `md:`, `lg:` prefixes. Mobile-first styling.
- Icons: Import from `lucide-react`

## Styling

- **Tailwind CSS v4**: Utility classes only. No custom CSS unless necessary (use `@apply` sparingly).
- **CSS Variables**: Theme colors in `app/globals.css` define `--foreground`, `--background`, `--primary`, etc.
- **Colors**: Use semantic tokens (`bg-primary`, `text-muted-foreground`) not raw hex codes.
- **Spacing**: Stick to Tailwind's 4px scale (1 unit = 0.25rem). Use `gap-4`, `p-4`, etc.

## Performance Best Practices

### Server Components
- Do data fetching in server component (no `useEffect` needed)
- Pass data to client components via props
- Avoid lifting state to parent if local state suffices

### Client Components
- Minimize use of `useState` and `useEffect`
- Prefer `useOptimistic` for instant updates (future)
- Memoize expensive calculations with `useMemo`
- Debounce/throttle event handlers

### Dashboard
- Avoid large libraries (Framer Motion banned)
- Use CSS `transform` and `opacity` for animations
- Keep JS bundles small (code splitting automatic in Next.js)
- Lazy load heavy components with `next/dynamic` if needed

## Security Checklist

- [ ] User owns resource? (`authorize*` check)
- [ ] Input validated with Zod?
- [ ] SQL injection prevented? (Prisma safe)
- [ ] XSS prevented? (Slate.js sanitizes HTML)
- [ ] API keys not exposed? (`OPENROUTER_API_KEY` server-only)
- [ ] File uploads validated? (check MIME type, size)
- [ ] CORS handled? (Supabase + Next.js default good)

## Internationalization

No i18n implemented yet. If adding:
- Use `next-intl` or `react-i18next`
- Extract all user-facing strings
- RTL support? (unlikely needed)

## Testing Conventions (Future)

If adding tests:
- Place test files next to source: `component.test.tsx` or `__tests__/component.test.tsx`
- Use Vitest or Jest + React Testing Library
- E2E: Playwright
- Mock Prisma with a test double or use SQLite in-memory

---

# Common Gotchas

1. **Line Endings**: CRLF → TypeScript parse errors. Use LF.
2. **Prisma v7Adapter**: Must pass adapter to PrismaClient. Don't use `url` in schema.
3. **Auth**: Always call `requireUser()` first in server actions. Don't assume `user` from client.
4. **Dates**: Dates from DB are Date objects, from forms are strings. Parse/validate carefully.
5. **Null vs Undefined**: Optional DB fields return `null`. Form optional fields may be `undefined`. Handle both.
6. **Revalidation**: Forgetting `revalidatePath()` leads to stale UI. Always revalidate after mutations.
7. **`as const`**: Use when passing literal arrays to Prisma `in` queries to keep literal types.
8. **Include Relations**: Always `include` needed relations; otherwise they're `null`/`undefined`.

---

# Refactoring Opportunities (Technical Debt)

1. **DTO Helpers use `any`**: Replace with proper Prisma select types or remove transformers by aligning Prisma schema with API types more closely.
2. **Unused Imports**: Several files have unused imports (`createClient`, `updateNoteSchema`, etc.) - clean up.
3. **CRLF Line Endings**: Convert all files to LF. Set `.gitattributes`.
4. **Missing Tests**: Add unit tests for server actions and utilities.
5. **Error Messages**: Some error messages are too generic. Consider i18n or more specific user messages.
6. **API Route Duplication**: `app/api/ai/route.ts` duplicates logic from `lib/actions/ai.actions.ts`. Consolidate or differentiate clearly.
7. **Authorization Helper Return Types**: Some return `boolean` (`isProjectMember`), others throw (`authorize*`). Be consistent or document clearly.
8. **Flashcard SM-2 Implementation**: Hard to read - extract to separate function with comments explaining algorithm.
