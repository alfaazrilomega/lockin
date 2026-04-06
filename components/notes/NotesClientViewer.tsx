"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { NoteCard } from "@/components/shared/note-card"
import { Button } from "@/components/ui/button"
import { Plus, StickyNote, Loader2 } from "lucide-react"
import { NewNoteDialog } from "@/components/shared/new-note-dialog"
import { type Note } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export function NotesClientViewer() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axios.get('/api/notes', {
          withCredentials: true
        })
        
        if (response.data.success) {
          setNotes(response.data.data)
        } else {
          throw new Error(response.data.error || 'Failed to load notes')
        }
      } catch (err: unknown) {
        console.error('Notes fetch error:', err)
        let errorMsg = "Failed to load notes"
        if (axios.isAxiosError(err) && err.response?.data?.error) {
          errorMsg = err.response.data.error
        } else if (err instanceof Error) {
          errorMsg = err.message
        }
        setError('There was an error fetching your notes. Please try again later.')
        toast({
          title: "Error fetching notes",
          description: errorMsg,
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [toast])

  // Expose a public refresh function for the dialog
  const refreshNotes = () => {
    // Simply retrigger the exact same logic (simplified for brevity)
    // In a real app we'd use SWR or React Query, but we will duplicate fetch logic here or use a reload pattern
    axios.get('/api/notes', { withCredentials: true })
      .then(res => { if(res.data.success) setNotes(res.data.data) })
      .catch(console.error)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse">Loading your notes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-4">
          <StickyNote className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">Failed to load notes</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-satoshi">
            Your Notes
          </h1>
          <p className="text-muted-foreground">
            Organize recordings, summaries, and meeting transcripts.
          </p>
        </div>
        <NewNoteDialog onSuccess={refreshNotes}>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </NewNoteDialog>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center border-2 border-dashed border-border rounded-xl p-12 bg-muted/20">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <StickyNote className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold">No notes yet</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Quickly capture ideas or record meetings and let LockIn generate summaries and flashcards for you.
          </p>
          <NewNoteDialog onSuccess={refreshNotes}>
            <Button className="mt-8 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Note
            </Button>
          </NewNoteDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  )
}
