import { getUserNotes } from "@/lib/actions/note.actions"
import { createClient } from "@/lib/supabase/server"
import { NoteCard } from "@/components/shared/note-card"
import { Button } from "@/components/ui/button"
import { Plus, StickyNote } from "lucide-react"
import { redirect } from "next/navigation"
import { NewNoteDialog } from "@/components/shared/new-note-dialog"
import { type Note } from "@/lib/types"

export default async function NotesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: notes, error } = await getUserNotes(user.id)

  if (error || !notes) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-4">
          <StickyNote className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">Failed to load notes</h2>
        <p className="text-muted-foreground mt-2">There was an error fetching your notes. Please try again later.</p>
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
        <NewNoteDialog>
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
          <NewNoteDialog>
            <Button className="mt-8 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Note
            </Button>
          </NewNoteDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note: Note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  )
}
