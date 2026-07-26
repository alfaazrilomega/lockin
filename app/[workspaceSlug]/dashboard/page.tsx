import { getTasks, getTags } from '@/actions/tasks'
import { getWorkspaceData } from '@/actions/workspace'
import { KanbanBoard } from '@/components/shared/kanban-board'

export const dynamic = 'force-dynamic'

interface TaskWorkspacePageProps {
  params: Promise<{ workspaceSlug: string }>
}

export default async function TaskWorkspacePage({ params }: TaskWorkspacePageProps) {
  const { workspaceSlug } = await params
  const [tasks, tags, workspace] = await Promise.all([
    getTasks(workspaceSlug),
    getTags(),
    getWorkspaceData(workspaceSlug)
  ])

  return (
    <div className="space-y-6 font-satoshi">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl font-satoshi">
          HR Task Management
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-outfit">
          Kelola alur kerja tim, status tugas, dan kolaborasi berkas real-time.
        </p>
      </div>

      {/* Main Kanban & Tremor Table View */}
      <KanbanBoard
        initialTasks={tasks as any}
        availableTags={tags}
        workspaceMembers={workspace.members as any}
      />
    </div>
  )
}
