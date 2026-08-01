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
    const trimmedTitle = formData.title.trim()
    if (!trimmedTitle) {
      toast({
        title: "Judul Wajib Diisi",
        description: "Silakan masukkan judul tugas terlebih dahulu.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Safe deadline ISO conversion
    let formattedDeadline: string | undefined = undefined
    if (formData.deadline && formData.deadline.trim()) {
      const parsedDate = new Date(formData.deadline)
      if (!isNaN(parsedDate.getTime())) {
        formattedDeadline = parsedDate.toISOString()
      }
    }

    try {
      const response = await axios.post(
        '/api/tasks',
        {
          title: trimmedTitle,
          description: formData.description.trim() || undefined,
          status: formData.status,
          deadline: formattedDeadline,
          projectId: projectId || undefined,
        },
        {
          withCredentials: true,
        }
      )

      if (response.data?.success) {
        setIsOpen(false)
        setFormData({ title: "", description: "", deadline: "", status: "TODO" })

        toast({
          title: "Tugas Berhasil Disimpan",
          description: `Tugas "${trimmedTitle}" telah berhasil ditambahkan ke database.`,
        })

        if (onSuccess) {
          onSuccess()
        } else {
          window.location.reload()
        }
      } else {
        const errorMsg = response.data?.error || "Gagal menyimpan tugas ke database."
        console.error('[NewTaskDialog Submit Error]:', response.data)
        toast({
          title: "Gagal Menyimpan Tugas",
          description: errorMsg,
          variant: "destructive",
        })
      }
    } catch (error: unknown) {
      console.error('[NewTaskDialog Catch Error]:', error)
      let errorMessage = "Terjadi kesalahan yang tidak terduga saat menyimpan data."

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message || errorMessage
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: "Gagal Menyimpan Tugas",
        description: errorMessage,
        variant: "destructive",
      })
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
        <form id="new-task-form" onSubmit={handleSubmit}>
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
            <Button type="submit" form="new-task-form" disabled={isLoading || !formData.title.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
