import { getDashboardStats } from "@/lib/actions/dashboard.actions"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, FileText, Users, TrendingUp, Activity, Clock } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { NewProjectDialog } from "@/components/shared/new-project-dialog"
import { type Project } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: stats, error } = await getDashboardStats()

  if (error || !stats) {
    // In a real app, handle error UI
    return <div>Error loading dashboard stats</div>
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-satoshi">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <NewProjectDialog>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-200 hover:scale-[1.02]">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </NewProjectDialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-background border-border shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-outfit">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Total managed projects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-outfit">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tasks in progress
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-outfit">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Successfully finished tasks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-outfit">{stats.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">
              Due in next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your projects and teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Updated Note: Project Specs</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New meeting scheduled</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-4"> {/* Added mt-4 for spacing */}
              <h3 className="text-lg font-semibold text-foreground">Recent Projects</h3>
              {stats.recentProjects.map((project: Project) => (
                <div key={project.id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                      {project.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project._count?.tasks || 0} tasks</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/projects/${project.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start hover:bg-muted font-medium transition-colors">
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </Button>

              <Button variant="outline" className="w-full justify-start hover:bg-muted font-medium transition-colors">
                <FileText className="mr-2 h-4 w-4" />
                Add New Note
              </Button>

              <Button variant="outline" className="w-full justify-start hover:bg-muted font-medium transition-colors">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>

              <Button variant="outline" className="w-full justify-start hover:bg-muted font-medium transition-colors">
                <Users className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}