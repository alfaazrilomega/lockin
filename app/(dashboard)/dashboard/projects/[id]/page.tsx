import { getProjectById } from "@/lib/actions/project.actions"
import { createClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Plus, 
  MoreHorizontal,
  ArrowLeft
} from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { NewTaskDialog } from "@/components/shared/new-task-dialog"
import { NewNoteDialog } from "@/components/shared/new-note-dialog"
import { type Task, type ProjectMember, type Note } from "@/lib/types"

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: project, error } = await getProjectById(params.id)

  if (error || !project) {
    redirect('/dashboard/projects')
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Back Button */}
      <div className="flex flex-col space-y-4">
        <Link 
          href="/dashboard/projects" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground font-satoshi">
              {project.name}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {project.description || "Empowering your workflow with LockIn's integrated workspace."}
            </p>
          </div>
          <div className="flex space-x-2">
            <NewNoteDialog projectId={project.id}>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </NewNoteDialog>
            <NewTaskDialog projectId={project.id}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </NewTaskDialog>
          </div>
        </div>
      </div>

      {/* Project Metadata & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              <span className="font-medium">Deadline:</span>
              <span className="ml-2 text-foreground">{project.deadline ? formatDate(project.deadline) : "No deadline"}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="font-medium">Team:</span>
              <span className="ml-2 text-foreground">{(project.members?.length ?? 0)} members</span>
            </div>
          </div>

          <div className="space-y-3 p-6 rounded-xl border border-border bg-muted/20">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Overall Progress</h3>
              <span className="text-2xl font-bold font-outfit text-primary">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3 shadow-inner" />
          </div>
        </div>

        <div className="space-y-4 p-6 rounded-xl border border-border bg-background shadow-sm">
          <h3 className="text-sm font-bold text-foreground">Project Owner</h3>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {(project.owner?.name?.[0] ?? 'O').toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">{project.owner?.name}</p>
              <p className="text-xs text-muted-foreground">{project.owner?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="bg-muted/50 p-1 mb-6">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="mr-2 h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-satoshi">Project Tasks</h2>
            <Badge variant="secondary" className="font-outfit">
              {(project.tasks?.length ?? 0)} Total
            </Badge>
          </div>
          <div className="grid gap-4">
            {(project.tasks?.length ?? 0) === 0 ? (
              <div className="text-center py-12 bg-muted/10 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground">No tasks assigned to this project yet.</p>
                <NewTaskDialog projectId={project.id}>
                  <Button variant="link" className="mt-2 text-primary font-semibold">Create your first task</Button>
                </NewTaskDialog>
              </div>
            ) : (
              (project.tasks ?? []).map((task: Task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all group">
                  <div className="flex items-center space-x-4">
                    <CheckCircle2 className={`h-5 w-5 ${task.status === 'DONE' ? 'text-green-500 fill-green-50' : 'text-muted-foreground'}`} />
                    <div>
                      <p className={`text-sm font-medium ${task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] scale-90 origin-left">
                          {task.status}
                        </Badge>
                        {task.deadline && (
                          <span className="text-[10px] text-muted-foreground flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(task.deadline)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="group-hover:text-primary">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-satoshi">Team Members</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(project.members ?? []).map((member: ProjectMember) => (
              <Card key={member.id} className="overflow-hidden border-border hover:border-primary/30 transition-colors">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {member.user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{member.user.name || member.user.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{member.roleName}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-satoshi">Project Notes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(project.notes?.length ?? 0) === 0 ? (
              <div className="text-center py-12 bg-muted/10 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground">No notes recorded for this project.</p>
              </div>
            ) : (
              (project.notes ?? []).map((note: Note) => (
                <Card key={note.id} className="border-border hover:border-primary/30 transition-colors cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">{note.title}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(note.createdAt)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {note.summary || note.content || "No content summary available."}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
