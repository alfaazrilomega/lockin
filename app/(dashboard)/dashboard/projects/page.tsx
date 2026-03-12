import { getUserProjects } from "@/lib/actions/project.actions"
import { createClient } from "@/lib/supabase/server"
import { ProjectCard } from "@/components/shared/project-card"
import { Button } from "@/components/ui/button"
import { Plus, FolderOpen } from "lucide-react"
import { redirect } from "next/navigation"
import { NewProjectDialog } from "@/components/shared/new-project-dialog"
import { type Project } from "@/lib/types"

export default async function ProjectsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: projects, error } = await getUserProjects(user.id)

  if (error || !projects) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-4">
          <FolderOpen className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">Failed to load projects</h2>
        <p className="text-muted-foreground mt-2">There was an error fetching your projects. Please try again later.</p>
        <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-satoshi">
            Your Projects
          </h1>
          <p className="text-muted-foreground">
            Manage your workspaces and collaborate with your team.
          </p>
        </div>
        <NewProjectDialog>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </NewProjectDialog>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center border-2 border-dashed border-border rounded-xl p-12 bg-muted/20">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <FolderOpen className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold">No projects found</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            You haven&apos;t created or joined any projects yet. Start by creating a new project to organize your tasks and notes.
          </p>
          <NewProjectDialog>
            <Button className="mt-8">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </NewProjectDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
