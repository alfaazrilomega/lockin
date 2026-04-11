# LockIn Project Overview

**Purpose**: LockIn is an all-in-one productivity and adaptive learning workspace built as a capstone project for Dicoding CC26-PS118. It solves context switching problems by integrating calendar, project management, smart notes with AI transcription/transcription, and interactive flashcards with spaced repetition.

**Core Problem**: Context switching between different apps (calendar, to-do, meeting notes) reduces productivity by up to 20%. LockIn centralizes everything into one workspace.

**Key Features**:
1. Centralized calendar with project deadlines, meetings, and flashcard reviews
2. Smart Notes with Slate.js rich-text editor + audio recording + AI transcription & summarization
3. Project Management with real-time progress tracking (0-100%) and role-based permissions (LEADER/EDITOR/VIEWER)
4. Adaptive Learning Flashcards with SM-2 spaced repetition algorithm
5. AI Integration via OpenRouter (minimax/minimax-m2.5:free, Gemini 2.5 Flash)

**Target Users**: Students, interns, freelancers, small business owners who need to organize priorities and projects.

**Business Logic**:
- Projects have owners and members with permission levels
- Tasks support a workflow: TODO → IN_PROGRESS → REVIEW → REVISION → DONE
- Proof of work system: tasks can have proof URLs and notes
- Notes can be linked to projects and generate flashcard decks automatically
- Calendar aggregates task deadlines and meeting dates

---

# Tech Stack (Deep)

**Frontend**:
- Next.js 16.1.6 (App Router, React 19)
- TypeScript 5.9.3 (strict mode)
- Tailwind CSS v4 with PostCSS
- Shadcn UI (Radix Vega components)
- Fonts: Inter (sans), Outfit (display), Playfair Display (serif) via next/font
- Motion/Framer Motion (landing page only - performance constraints)
- Lenis smooth scrolling (landing page)

**Backend & Data**:
- Supabase (PostgreSQL + Auth + Storage)
- Prisma ORM v7.4.2 with `@prisma/adapter-pg` (adapter pattern required in v7)
- Server Actions (`"use server"`) for all mutations - no direct client API calls
- Zod for validation schemas

**AI/ML**:
- OpenRouter API integration (wraps OpenAI SDK)
- Models: minimax/minimax-m2.5:free (default), google/gemini-2.5-flash-lite (audio)
- Features: meeting summary, flashcard generation, audio transcription

**Icons & Utilities**:
- Lucide React icons
- date-fns for formatting
- clsx + tailwind-merge for `cn()` utility
- next-themes for dark mode

---

# Code Style & Conventions

## General Principles

1. **Server Components by Default**: All components are server-side unless marked `"use client"`. Client components must explicitly opt-in.
2. **Server Actions Only**: All database mutations use server actions in `lib/actions/*`. Client components call these directly (no custom API routes).
3. **Path Aliases**: `@/*` maps to project root. Use `@/components/ui/button` instead of relative paths.
4. **TypeScript Strict**: No `any` types allowed in production code (lint error). However, helper DTO functions currently use `any` for Prisma transforms - this should be improved to proper types.
5. **Error Handling**: All server actions use try/catch with structured `{ success: boolean; data?: T; error?: string }` responses.
6. **Logging**: Console error logging in catch blocks for debugging.
7. **Revalidation**: `revalidatePath()` called after mutations to update Next.js cache (SSR).

## File Structure Conventions

```
app/
├── layout.tsx (root) - ThemeProvider, Preloader, fonts
├── page.tsx (landing)
├── globals.css (Tailwind imports, CSS variables)
├── auth/[route]/page.tsx (sign-in, sign-up)
├── (dashboard)/ (route group - authenticated)
│   ├── layout.tsx (sidebar, top-nav)
│   ├── loading.tsx
│   ├── dashboard/page.tsx
│   ├── overview/page.tsx
│   ├── notes/[id]/page.tsx (dynamic)
│   └── projects/[id]/page.tsx (dynamic)
└── api/
    ├── ai/route.ts (POST only, server action)
    └── auth/* (Supabase callbacks - not used currently)

components/
├── ui/ (shadcn pre-built: button, card, dialog, etc.)
├── layout/ (Sidebar, TopNav, Preloader, SmoothScrolling)
├── auth/ (auth UI)
├── notes/ (note-specific components)
├── shared/ (composite: new-*-dialog, recent-task-list)
└── theme-provider.tsx

lib/
├── actions/ (server actions: *.actions.ts)
├── supabase/ (server.ts, client.ts)
├── validations/ (Zod schemas)
├── prisma.ts (singleton client with adapter)
├── openrouter.ts (AI client)
├── types.ts (TypeScript interfaces & enums)
└── utils.ts (cn, formatDate, formatDateTime)

prisma/
├── schema.prisma (database schema)
└── migrations/ (generated)
```

## Naming Conventions

- **Files**: kebab-case for pages/app files (`note-details-client.tsx`), PascalCase for components (`NewNoteDialog.tsx`)
- **Components**: PascalCase
- **Functions/Variables**: camelCase
- **Types/Interfaces/Enums**: PascalCase
- **Constants**: UPPER_SNAKE_CASE (e.g., `NEXT_PUBLIC_*`)
- **Database fields**: snake_case (via Prisma `@map`)

## Database Conventions

- **User IDs**: Use Supabase Auth `id` directly (no UUID generation in Prisma). `User.id` is NOT auto-generated.
- **Timestamps**: `createdAt`/`updatedAt` in TypeScript, mapped to `created_at`/`updated_at` in DB via `@map`.
- **Foreign Keys**: Explicit `@map` to snake_case (e.g., `ownerId` maps to `owner_id`).
- **Enums**: Prisma enums (TaskStatus, PermissionLevel) stored as strings in DB.
- **Text Fields**: Long text uses `@db.Text` (e.g., `transcript`, `summary`, `feedback`).

## Authentication/Authorization Pattern

- **Require Auth**: `requireUser()` throws if no session or user not in DB.
- **Project Access**: `isProjectMember(projectId, userId)` - returns boolean.
- **Modify Permissions**: `authorizeProjectModify(projectId, userId)`, `authorizeTaskModify(taskId, userId)`, etc. - throws if unauthorized.
- **Read Access**: `authorizeNoteAccess(noteId, userId)`, `authorizeDeckModify(deckId, userId)`.
- **All server actions** that modify resources must call appropriate authorization helpers.

## Validation Pattern

- All server actions Zod-validate input using schemas from `lib/validations/index.ts`.
- Schema naming: `createXSchema`, `updateXSchema` (partial for updates).
- Date strings are parsed to Date objects via `.transform(val => val ? new Date(val) : null)`.
- Transformations handle optional/nullable fields properly (`val || null`).

## TypeScript Patterns

- **DTO Transformers**: Helper functions `toProjectDTO(project: any)`, `toTaskDTO(task: any)`, etc. convert Prisma snake_case fields to camelCase TypeScript types. **Current anti-pattern**: uses `any`; should use `Prisma.Task` or `Select` types.
- **API Response**: All actions return `{ success: boolean; data?: T; error?: string }`.
- **Enums as const**: Use `as const` for literal arrays in Prisma `in` queries (e.g., `status: { in: [...] as const }`) to preserve literal types.

---

# Commands After Task Completion

## Essential Commands

```bash
# Type checking (MUST PASS before committing)
npx tsc --noEmit

# Linting (ESLint with Next.js config)
npm run lint

# Format checking
# (No formatter configured - consider Prettier)

# Build verification (recommended)
npm run build

# Database
npx prisma generate          # If schema changed
npx prisma db push          # Sync to dev DB
npx prisma studio           # Inspect data

# Dev server
npm run dev                 # http://localhost:3000
```

## Pre-commit/Pre-PR Checklist

1. ✅ `npx tsc --noEmit` passes with no errors
2. ✅ `npm run lint` passes with no errors (warnings OK but fix them)
3. ✅ Application runs in dev (`npm run dev`) and features work
4. ✅ Database changes pushed (`npx prisma db push`) and tested
5. ✅ No hardcoded secrets or environment variables
6. ✅ Authorization checks present on modify actions
7. ✅ Input validation with Zod on all server actions
8. ✅ Proper error handling with try/catch and user-friendly messages
9. ✅ `revalidatePath()` called after mutations

---

# Testing, Formatting, Linting

## Current State

- **Testing**: No test framework configured. Consider Vitest + React Testing Library or Playwright for E2E.
- **Formatting**: No Prettier config. Use IDE formatting with project's ESLint rules.
- **Linting**: ESLint v9 with Next.js core-web-vitals + typescript configs.

## Lint Issues to Watch For

- `@typescript-eslint/no-unused-vars`: Remove unused imports/variables
- `@typescript-eslint/no-explicit-any`: Replace `any` with proper types
- `react-hooks/exhaustive-deps`: Ensure effect dependencies are correct (see Preloader.tsx warning)
- `@next/next/no-img-element`: Use `next/image` instead of `<img>`
- `@typescript-eslint/ban-ts-comment`: Avoid `@ts-ignore` unless absolutely necessary

## TypeScript Strict Mode

- `strict: true` in tsconfig.json
- `noEmit: true` (type-check only)
- `esModuleInterop: true`
- `moduleResolution: bundler` (Next.js)

---

# Entry Points & Routing

## Public Routes

- `/` → `app/page.tsx` (Landing page, uses Lenis + Motion)
- `/auth/sign-in` → `app/auth/sign-in/page.tsx`
- `/auth/sign-up` → (planned but not implemented)

## Protected Dashboard Routes

All `/dashboard/*` routes require authentication via `proxy.ts` middleware.

- `/dashboard` → `app/(dashboard)/dashboard/page.tsx`
- `/dashboard/overview` → `app/(dashboard)/overview/page.tsx`
- `/dashboard/notes` → `app/(dashboard)/notes/page.tsx`
- `/dashboard/notes/[id]` → `app/(dashboard)/notes/[id]/page.tsx`
- `/dashboard/projects` → `app/(dashboard)/projects/page.tsx`
- `/dashboard/projects/[id]` → `app/(dashboard)/projects/[id]/page.tsx`
- `/dashboard/calendar` → (planned but missing)

## API Routes

- `POST /api/ai` → `app/api/ai/route.ts` - AI aggregation (summary/flashcards)
- `GET /api/auth/callback` → Supabase auth callback (not implemented yet)

---

# Windows-Specific Commands

Since you're on Windows 10 Pro (win32), note:

- Bash in VS Code/WSL uses Unix-style commands (`/dev/null`, forward slashes)
- Git handles line endings with `core.autocrlf` - see `.gitattributes` if present
- Use `dos2unix` or VS Code's "Change End of Line Sequence" to convert CRLF → LF
- **Critical**: All TypeScript files should use LF line endings to avoid parser issues

---

# Critical Pitfalls & Gotchas

## 1. **Prisma v7 Adapter Pattern**
- ❌ DON'T put `url` or `directUrl` in `schema.prisma`
- ✅ Connection string lives in `lib/prisma.ts` via `PrismaPg` adapter
- ✅ Pool configuration also in `lib/prisma.ts`
- ✅ After schema changes: `npx prisma generate` then `npx prisma db push`

## 2. **Supabase SSR**
- ❌ DON'T use `@supabase/supabase-js` client in server components
- ✅ Use `@supabase/ssr` helpers: `createServerClient()` in `lib/supabase/server.ts`
- ✅ For client components: `createBrowserClient()` in `lib/supabase/client.ts`
- ✅ Pass cookies correctly in middleware and server components

## 3. **Middleware Routing**
- Middleware file is `proxy.ts` (NOT `middleware.ts` by convention)
- Configured via `next.config.ts` matcher or standalone
- **IMPORTANT**: Skip `/api/auth` routes from redirects to avoid breaking callbacks

## 4. **Performance Constraints (Dashboard)**
- NO Framer Motion, WebGL, 3D Canvas in Dashboard (only CSS `transform`/`opacity`)
- Use View Transitions API and Speculation Rules for instant navigation (to be implemented)
- Maintain INP < 200ms - keep JS minimal, prefer SSR
- Landing page can use Motion and Lenis (acceptable)

## 5. **User ID Management**
- User IDs come from Supabase Auth (`user.id`)
- Prisma `User.id` is **NOT auto-generated** - must match Supabase UID
- `requireUser()` ensures user exists in both Supabase and our DB
- Never use `uuid()` for User.id in Prisma schema

## 6. **AI Token Costs**
- Using OpenRouter with `minimax/minimax-m2.5:free` (free tier has limits)
- Monitor usage in OpenRouter dashboard
- Consider adding rate limiting or daily quotas before production

## 7. **Line Endings (Windows)**
- **CRLF line endings cause TypeScript parser errors** (see `dashboard.actions.ts`)
- Set `.gitattributes` with `* text=auto` or configure Git `core.autocrlf`
- VS Code: bottom-right status bar → "CRLF" → click → select "LF"
- Convert existing files: `dos2unix` (install via WSL/Cygwin) or VS Code batch replace

---

# Design Patterns Observed

## 1. Server Action Pattern
```typescript
"use server"

export async function actionName(data: FormData): Promise<ApiResponse<T>> {
  try {
    // 1. Validate with Zod
    const valid = schema.parse(data)
    // 2. Authorize (throw if unauthorized)
    const { user } = await requireUser()
    await authorizeResource(resourceId, user.id)
    // 3. Perform DB operation with prisma
    const result = await prisma.resource.create(...)
    // 4. Revalidate paths
    revalidatePath('/path')
    // 5. Return success DTO
    return { success: true, data: toDTO(result) }
  } catch (error) {
    // 6. Error handling
    console.error(...)
    return { success: false, error: user-friendly message }
  }
}
```

## 2. DTO Transformer Pattern
- Helper functions convert Prisma models (with snake_case DB fields) to clean TypeScript interfaces (camelCase).
- Example: `toProjectDTO(project: any): Project` maps `created_at` → `createdAt`, `owner_id` → `ownerId`.

## 3. Protected Layout Pattern
- `(dashboard)/layout.tsx` fetches current user via `createClient()` (server component)
- Passes `currentUser` to client-side `SidebarWrapper` and `TopNav`
- Unauthenticated users redirected by `proxy.ts` before reaching layout.

## 4. Date Handling
- Dates stored as ISO strings from API/form inputs
- Validated with `z.string().datetime()` then transformed to `Date` objects
- DB stores as `DateTime` (PostgreSQL timestamptz)
- Formatting with `date-fns`: `formatDate()`, `formatDateTime()`

---

# Security Considerations

- **Authorization**: All modify actions verify ownership/membership via auth helpers
- **Input Validation**: Zod schemas validate all inputs (length limits, formats, required fields)
- **SQL Injection**: Prisma ORM prevents raw SQL injection (no `prisma.$executeRaw` in codebase)
- **XSS**: Note content rendered? (check if using `dangerouslySetInnerHTML` or Slate.js safe rendering)
- **API Keys**: `OPENROUTER_API_KEY` must be kept secret (server-only)
- **File Uploads**: Audio URLs stored - ensure Supabase Storage policies secure uploads
- **CORS**: Handled by Supabase and Next.js automatically

---

# Performance Guidelines (From README)

**Dashboard Pages** (most important):
- ✅ SSR-first, minimize client-side JS
- ✅ Use `useOptimistic`? (not yet implemented)
- ✅ GPU-accelerated animations only (`tailwindcss-animate`)
- ❌ NO Framer Motion, NO WebGL/Canvas, NO heavy libraries
- ✅ Target INP < 200ms

**Landing Page** (`/`):
- ✅ Lenis smooth scrolling + Motion allowed (marketing)
- Keep below the fold lazy-loaded

---

# Next Steps for New Developers

1. Read `README.md` and `CLAUDE.md` thoroughly
2. Set up `.env` from `.env.example` with Supabase and OpenRouter keys
3. Run `npx prisma generate && npx prisma db push` to set up DB
4. Run `npm run dev` and verify landing page + sign-up flow
5. Explore `lib/actions/` to understand server action patterns
6. Review `prisma/schema.prisma` to understand data model
7. Check `components/` for UI component patterns (shadcn usage)
8. Familiarize with `lib/validations/` and `lib/auth-helpers.ts`

---

# Additional Notes

- **Skill System**: Project uses Claude Code skills (`.agent/skills/`). Read skill docs before implementing features.
- **Git Workflow**: Conventional Commits recommended (`feat:`, `fix:`, `docs:`, `refactor:`)
- **No tests yet**: Consider writing tests alongside features using Vitest/RTL.
- **Deployment**: Vercel + Supabase. Set all env vars in Vercel dashboard.
