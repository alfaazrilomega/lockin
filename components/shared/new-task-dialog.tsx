"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

interface NewTaskDialogProps {
  projectId: string
  children?: React.ReactNode
  onSuccess?: () => void
}

export function NewTaskDialog({ projectId, children, onSuccess }: NewTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<{
    title: string
    description: string
    deadline: string
    status: string
  }>({
    title: "",
    description: "",
    deadline: "",
    status: "TODO",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title) return

    setIsLoading(true)
    try {
      const response = await axios.post('/api/tasks', {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        projectId,
      }, {
        withCredentials: true
      })

      if (response.data.success) {
        setIsOpen(false)
        setFormData({ title: "", description: "", deadline: "", status: "TODO" })
        
        toast({
          title: "Success",
          description: "Task created successfully",
        })

        if (onSuccess) {
          onSuccess()
        } else {
          window.location.reload()
        }
      } else {
        toast({
          title: "Error",
          description: response.data.error || "Failed to create task",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "An unexpected error occurred",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-1 h-4 w-4" />
            Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-satoshi">Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="e.g. Design Landing Page"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Briefly describe the task..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {["TODO", "IN_PROGRESS", "REVIEW", "DONE"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
