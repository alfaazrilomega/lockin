"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

interface NewNoteDialogProps {
  projectId?: string
  children?: React.ReactNode
  onSuccess?: () => void
}

export function NewNoteDialog({ projectId, children, onSuccess }: NewNoteDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    meetingDate: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title) return

    setIsLoading(true)
    try {
      const response = await axios.post('/api/notes', {
        title: formData.title,
        content: formData.content,
        projectId: projectId,
        meetingDate: formData.meetingDate ? new Date(formData.meetingDate).toISOString() : undefined,
      }, {
        withCredentials: true
      })

      if (response.data.success && response.data.data) {
        setIsOpen(false)
        setFormData({ title: "", content: "", meetingDate: "" })
        
        toast({
          title: "Success",
          description: "Note created successfully",
        })
        
        // Notify parent to refresh list, or redirect
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(`/dashboard/notes/${response.data.data.id}`)
        }
      } else {
        toast({
          title: "Error",
          description: response.data.error || "Failed to create note",
          variant: "destructive",
        })
      }
    } catch (error: unknown) {
      console.error(error)
      let errorMessage = "An unexpected error occurred"
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      toast({
        title: "Error",
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
          <Button size="sm" variant="outline" className="font-medium">
            <Plus className="mr-1 h-4 w-4" />
            Quick Note
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-satoshi">Create New Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="title">Note Title</Label>
              <Input
                id="title"
                placeholder="e.g. Brainstorming session"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingDate">Meeting Date (Optional)</Label>
              <Input
                id="meetingDate"
                type="datetime-local"
                value={formData.meetingDate}
                onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Initial Content (Optional)</Label>
              <textarea
                id="content"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Start typing your thoughts..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
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
              Create Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
