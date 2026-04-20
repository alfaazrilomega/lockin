"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { type PersonalTask, type TaskPriority, type PersonalTaskStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CheckSquare, Plus, Loader2, CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react"
import { formatDate } from "@/lib/utils"

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: "text-red-500 bg-red-500/10 border-red-500/20",
  MEDIUM: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  LOW: "text-green-500 bg-green-500/10 border-green-500/20",
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  PENDING: Circle,
  IN_PROGRESS: Clock,
  DONE: CheckCircle2,
  CANCELLED: AlertTriangle,
}

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
]

function CreateTaskDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as TaskPriority,
    status: "PENDING" as PersonalTaskStatus,
    dueDate: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post("/api/personal-tasks", {
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        isRecurring: false,
        tags: [],
      })
      setOpen(false)
      setForm({ title: "", description: "", priority: "MEDIUM" as TaskPriority, status: "PENDING" as PersonalTaskStatus, dueDate: "" })
      onSuccess()
    } catch (err) {
      console.error("Failed to create task:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Personal Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="What do you need to do?"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-desc">Description (optional)</Label>
            <Input
              id="task-desc"
              placeholder="Add details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as TaskPriority })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">🔴 High</SelectItem>
                  <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                  <SelectItem value="LOW">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due">Due Date</Label>
              <Input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading || !form.title.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function PersonalTasksPage() {
  const [tasks, setTasks] = useState<PersonalTask[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : ""
      const res = await axios.get(`/api/personal-tasks${params}`, { withCredentials: true })
      if (res.data.success) setTasks(res.data.data)
    } catch (err) {
      console.error("Failed to fetch personal tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [statusFilter])

  const handleCompleteTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "DONE" ? "PENDING" : "DONE"
    
    // 1. Optimistic Update (Zero-latency UI)
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus as PersonalTaskStatus } : t
    ))

    // 2. Background API Sync
    try {
      await axios.patch(`/api/personal-tasks/${taskId}`, { status: newStatus })
      // We don't need to fetchTasks() on success because our optimistic state is already correct,
      // but we can do it silently in the background if we want to ensure total sync.
      // fetchTasks() is omitted here to prevent a loading flash.
    } catch (err) {
      console.error("Failed to update task:", err)
      // 3. Rollback on failure
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: currentStatus as PersonalTaskStatus } : t
      ))
    }
  }

  const pendingTasks = tasks.filter(t => t.status !== "DONE" && t.status !== "CANCELLED")
  const doneTasks = tasks.filter(t => t.status === "DONE")

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-satoshi">
            My Tasks
          </h1>
          <p className="text-muted-foreground text-sm">
            Personal tasks visible only to you.
          </p>
        </div>
        <CreateTaskDialog onSuccess={fetchTasks} />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg w-fit">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              statusFilter === f.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="space-y-2">
             <Skeleton className="h-4 w-24 mb-4" />
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background">
                 <Skeleton className="h-5 w-5 rounded-full" />
                 <div className="flex-1 space-y-2">
                   <Skeleton className="h-4 w-1/3" />
                   <Skeleton className="h-3 w-1/4" />
                 </div>
                 <div className="flex gap-2">
                   <Skeleton className="h-5 w-16" />
                   <Skeleton className="h-5 w-16" />
                 </div>
               </div>
             ))}
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CheckSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-foreground">No tasks found</h3>
            <p className="text-sm text-muted-foreground mt-1">Create your first personal task to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Active Tasks */}
          {pendingTasks.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active ({pendingTasks.length})
              </h2>
              <div className="space-y-2">
                {pendingTasks.map(task => {
                  const StatusIcon = STATUS_ICONS[task.status] ?? Circle
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/30 hover:bg-muted/20 transition-all group"
                    >
                      <button
                        onClick={() => handleCompleteTask(task.id, task.status)}
                        className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <StatusIcon className="h-5 w-5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {task.dueDate && (
                          <span className={`text-xs ${isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                            {isOverdue ? "⚠ " : ""}{formatDate(task.dueDate)}
                          </span>
                        )}
                        <Badge className={`text-[10px] border ${PRIORITY_COLORS[task.priority]}`}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Done Tasks */}
          {doneTasks.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Completed ({doneTasks.length})
              </h2>
              <div className="space-y-2">
                {doneTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/10 opacity-60 group"
                  >
                    <button
                      onClick={() => handleCompleteTask(task.id, task.status)}
                      className="shrink-0 text-green-500 hover:text-muted-foreground transition-colors"
                    >
                      <CheckCircle2 className="h-5 w-5 fill-green-500/20" />
                    </button>
                    <p className="text-sm text-muted-foreground line-through flex-1 truncate">{task.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
