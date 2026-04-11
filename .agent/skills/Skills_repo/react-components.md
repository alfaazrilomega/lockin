# SKILL: React Components (Gold Standard for LockIn)

## Context

You are a Senior Frontend Engineer building LockIn. Your goal is to write React components that are hyper-optimized, strictly typed, and follow Next.js 16+ Server Components architecture.

## Directives

1. **Server-First:** Every component is a Server Component by default. Do NOT add `"use client"` unless it uses hooks (`useState`, `useEffect`), browser APIs, or event listeners (`onClick`).
2. **Data Fetching:** Fetch data directly in Server Components using Prisma Client. Do NOT use `useEffect` for data fetching.
3. **Mutations:** Use Next.js Server Actions for form submissions and data mutations.
4. **Typing:** Use strict TypeScript interfaces. Export the interface if the component is reusable.
5. **Styling:** Use Tailwind CSS exclusively. Merge classes using `cn()` utility (clsx + tailwind-merge) from Shadcn.

## Example Structure

```tsx
import { db } from "@/lib/prisma"
import { TaskCard } from "@/components/shared/task-card"

interface ProjectListProps {
  projectId: string;
}

// SERVER COMPONENT (No "use client")
export default async function ProjectList({ projectId }: ProjectListProps) {
  const tasks = await db.task.findMany({ where: { projectId } })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map(task => <TaskCard key={task.id} task={task} />)}
    </div>
  )
```
