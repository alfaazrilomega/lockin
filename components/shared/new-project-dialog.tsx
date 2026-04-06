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

export function NewProjectDialog({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name) return

    setIsLoading(true)
    try {
      const response = await axios.post("/api/projects", {
        name: formData.name,
        description: formData.description,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
      }, {
        withCredentials: true
      })
      const result = response.data

      if (result.success && result.data) {
        setIsOpen(false)
        router.push(`/dashboard/projects/${result.data.id}`)
        toast({
          title: "Success",
          description: "Project created successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create project",
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
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-satoshi">Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="e.g. Q1 Marketing Campaign"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Briefly describe the goal..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
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
            <Button type="submit" disabled={isLoading || !formData.name}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
