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
    const trimmedName = formData.name.trim()
    if (!trimmedName) {
      toast({
        title: "Nama Proyek Wajib Diisi",
        description: "Silakan masukkan nama proyek terlebih dahulu.",
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
        "/api/projects",
        {
          name: trimmedName,
          description: formData.description.trim() || undefined,
          deadline: formattedDeadline,
        },
        {
          withCredentials: true,
        }
      )
      const result = response.data

      if (result?.success && result?.data) {
        setIsOpen(false)
        setFormData({ name: "", description: "", deadline: "" })
        toast({
          title: "Proyek Berhasil Dibuat",
          description: `Proyek "${trimmedName}" telah berhasil disimpan ke database.`,
        })
        router.push(`/dashboard/projects/${result.data.id}`)
        router.refresh()
      } else {
        const errorMsg = result?.error || "Gagal menyimpan proyek ke database."
        console.error('[NewProjectDialog Submit Error]:', result)
        toast({
          title: "Gagal Membuat Proyek",
          description: errorMsg,
          variant: "destructive",
        })
      }
    } catch (error: unknown) {
      console.error('[NewProjectDialog Catch Error]:', error)
      let errorMessage = "Terjadi kesalahan yang tidak terduga saat membuat proyek."

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message || errorMessage
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: "Gagal Membuat Proyek",
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
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form id="new-project-form" onSubmit={handleSubmit}>
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
            <Button type="submit" form="new-project-form" disabled={isLoading || !formData.name.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
