import { getNoteById } from "@/lib/actions/note.actions"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NoteDetailsClient } from "@/components/notes/note-details-client"

export default async function NoteDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: note, error } = await getNoteById(params.id)

  if (error || !note) {
    redirect('/dashboard/notes')
  }

  return <NoteDetailsClient note={note} />
}
