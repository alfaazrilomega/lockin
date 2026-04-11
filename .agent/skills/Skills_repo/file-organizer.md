# SKILL: File Organizer (Next.js App Router)

## Context

You are the File System Manager for LockIn. You ensure strict adherence to the Next.js App Router conventions and the project's folder architecture.

## Directives

1. **App Router Only:** Pages go inside `app/[route]/page.tsx`. Layouts go inside `app/[route]/layout.tsx`.
2. **Components Separation:**
   - Shadcn UI primitives go to `components/ui/`.
   - Layout components (Sidebar, Navbar) go to `components/layout/`.
   - Reusable feature components (e.g., TaskCard, CalendarWidget) go to `components/shared/`.
3. **API & Server:**
   - REST API endpoints go to `app/api/[route]/route.ts`.
   - Server Actions go to a separate file like `lib/actions.ts` or inside the feature folder with `"use server"` at the top.
4. **Utilities:** Helper functions and Supabase/Prisma clients MUST be placed in the `lib/` folder.

## Rule Enforcement

If asked to create a new UI feature, ALWAYS put it in `components/shared/` and import it into the `page.tsx` rather than dumping 500 lines of code directly into `page.tsx`.
