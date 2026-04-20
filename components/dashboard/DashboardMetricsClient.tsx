"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { type DashboardStatsV2, type Task, type PersonalTask, type Project } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ListTodo,
  TrendingUp,
  Clock,
  Zap,
  Target,
  ArrowRight,
  CalendarClock,
  ShieldAlert,
  Loader2,
  Plus,
  StickyNote,
  FolderOpen
} from "lucide-react"

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: "text-red-500 bg-red-500/10 border-red-500/20",
  MEDIUM: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  LOW: "text-green-500 bg-green-500/10 border-green-500/20",
}

const STATUS_COLORS: Record<string, string> = {
  TODO: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-blue-500/10 text-blue-500",
  REVIEW: "bg-purple-500/10 text-purple-500",
  REVISION: "bg-orange-500/10 text-orange-500",
  DONE: "bg-green-500/10 text-green-500",
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  colorClass = "text-primary",
}: {
  icon: React.ElementType
  label: string
  value: number | string
  description?: string
  colorClass?: string
}) {
  return (
    <Card className="border-border bg-background hover:border-primary/30 transition-all duration-200 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className={`text-4xl font-bold font-outfit tracking-tight ${colorClass}`}>{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors`}>
            <Icon className={`h-5 w-5 ${colorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardMetricsClient() {
  const [stats, setStats] = useState<DashboardStatsV2 | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await axios.get("/api/dashboard", { withCredentials: true })
        if (res.data.success) {
          setStats(res.data.data)
        } else {
          setError(res.data.error || "Failed to load dashboard")
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err)
        setError("Could not connect to the server. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your workspace…</p>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-sm text-muted-foreground">{error || "Something went wrong."}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  const { workload, velocity, intelligence } = stats

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Page Header ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-satoshi text-premium-black">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Your workspace at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/notes/new">
              <StickyNote className="mr-2 h-4 w-4" />
              New Note
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/projects">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Workload KPIs ────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label="Open Projects"
          value={workload.totalOpenProjects}
          description="Active & Planning"
          colorClass="text-primary"
        />
        <StatCard
          icon={ListTodo}
          label="Active Tasks"
          value={workload.activeTaskCount}
          description="Assigned to you"
          colorClass="text-blue-500"
        />
        <StatCard
          icon={AlertTriangle}
          label="Urgent"
          value={workload.urgentTaskCount}
          description="HIGH priority open"
          colorClass="text-red-500"
        />
        <StatCard
          icon={Target}
          label="Personal"
          value={workload.personalTaskCount}
          description="Focus tasks pending"
          colorClass="text-purple-500"
        />
      </div>

      {/* ── Velocity Strip ──────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border bg-gradient-to-br from-primary/5 to-background col-span-1">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed (7d)</p>
              <p className="text-3xl font-bold font-outfit text-foreground">{velocity.completedLast7Days}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-gradient-to-br from-amber-500/5 to-background col-span-1">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Story Pts Burned</p>
              <p className="text-3xl font-bold font-outfit text-foreground">{velocity.storyPointsBurned}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-gradient-to-br from-green-500/5 to-background col-span-1">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Clock className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Minutes Logged</p>
              <p className="text-3xl font-bold font-outfit text-foreground">{velocity.minutesSpentLogged}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Blocker Alerts ──────────────────────────────── */}
      {intelligence.blockers.length > 0 && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-500 text-sm font-semibold uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4" />
              Blocker Alerts ({intelligence.blockers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {intelligence.blockers.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-sm">
                <span className="text-foreground font-medium">{b.blockingTask.title}</span>
                {b.blockingTask.assignee && (
                  <span className="text-xs text-muted-foreground">→ {b.blockingTask.assignee.name}</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Bottom Grid (Active Tasks + Deadlines + Personal) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Assigned Tasks */}
        <Card className="border-border lg:col-span-1">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active Tasks</CardTitle>
            <Link href="/dashboard/projects" className="text-xs text-primary hover:underline flex items-center gap-1">
              All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {intelligence.swimlanes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No active tasks. 🎉</p>
            ) : (
              intelligence.swimlanes.slice(0, 6).map((task: Task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                    <span className="text-sm text-foreground truncate">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <Badge className={`text-[10px] border ${PRIORITY_COLORS[task.priority ?? 'LOW']}`}>
                      {task.priority ?? 'LOW'}
                    </Badge>
                    <Badge className={`text-[10px] ${STATUS_COLORS[task.status]}`}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="border-border lg:col-span-1">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Upcoming Deadlines</CardTitle>
            <Link href="/dashboard/calendar" className="text-xs text-primary hover:underline flex items-center gap-1">
              Calendar <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {intelligence.upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No upcoming deadlines.</p>
            ) : (
              intelligence.upcomingDeadlines.map((task: Task) => {
                const isOverdue = task.deadline && new Date(task.deadline) < new Date()
                return (
                  <div key={task.id} className="flex items-start justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <CalendarClock className={`h-4 w-4 shrink-0 ${isOverdue ? 'text-red-500' : 'text-primary'}`} />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate">{task.title}</p>
                        {(task as Task & { project?: { name: string } }).project?.name && (
                          <p className="text-xs text-muted-foreground truncate">
                            {(task as Task & { project?: { name: string } }).project?.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] shrink-0 ml-2 font-medium ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {task.deadline ? formatDate(task.deadline) : '—'}
                    </span>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Personal Focus Tasks */}
        <Card className="border-border lg:col-span-1">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Personal Focus</CardTitle>
            <Link href="/dashboard/personal-tasks" className="text-xs text-primary hover:underline flex items-center gap-1">
              All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {intelligence.priorityFocus.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No personal tasks. Add one!</p>
            ) : (
              intelligence.priorityFocus.map((task: PersonalTask) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${task.priority === 'HIGH' ? 'bg-red-500' : task.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-green-500'}`} />
                    <span className="text-sm text-foreground truncate">{task.title}</span>
                  </div>
                  <Badge className="text-[10px] bg-muted text-muted-foreground shrink-0 ml-2">
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Projects ─────────────────────────────── */}
      {intelligence.recentProjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intelligence.recentProjects.map((proj: Project) => (
              <Link key={proj.id} href={`/dashboard/projects/${proj.id}`} className="block">
                <Card className="border-border hover:border-primary/30 transition-all cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <FolderOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{proj.name}</p>
                          <p className="text-xs text-muted-foreground">{proj._count?.tasks ?? 0} tasks</p>
                        </div>
                      </div>
                      <Badge className="text-[10px] font-medium bg-muted text-muted-foreground capitalize">
                        {proj.status ?? 'Active'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-outfit font-semibold text-foreground">{proj.progress}%</span>
                      </div>
                      <Progress value={proj.progress} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
