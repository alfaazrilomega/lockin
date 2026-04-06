"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { StatCard } from "@/components/shared/stat-card"
import { ProjectCard } from "@/components/shared/project-card"
import { RecentTaskList } from "@/components/shared/recent-task-list"
import { type DashboardStats, type Project, type Task } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Activity, Clock } from "lucide-react"

export function DashboardMetricsClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axios.get('/api/dashboard', {
          withCredentials: true
        })
        if (response.data.success) {
          setStats(response.data.data)
        } else {
          setError(response.data.error || "Failed to load dashboard statistics")
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err)
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Failed to fetch dashboard stats.")
        } else {
          setError("An unexpected error occurred.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Sleek Skeleton Loaders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-muted/30 animate-pulse border border-border" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] rounded-xl bg-muted/30 animate-pulse border border-border" />
          <div className="h-[400px] rounded-xl bg-muted/30 animate-pulse border border-border" />
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return <div className="p-8 text-center text-destructive">{error || "Error loading dashboard stats"}</div>
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Active Tasks"
          value={stats.activeTasks}
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          title="Completed"
          value={stats.completedTasks}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Upcoming Deadlines"
          value={stats.upcomingDeadlines}
          icon={<Clock className="h-5 w-5" />}
          description="Due in next 7 days"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Projects</CardTitle>
            <CardDescription>
              Latest projects you&apos;re working on
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No projects yet. Create your first project!</p>
            ) : (
              <div className="space-y-3">
                {stats.recentProjects.map((project: Project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Upcoming Tasks</CardTitle>
            <CardDescription>
              Tasks due soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.upcomingDeadlineTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming deadlines. You&apos;re all caught up!</p>
            ) : (
              <RecentTaskList tasks={stats.upcomingDeadlineTasks as Task[]} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
