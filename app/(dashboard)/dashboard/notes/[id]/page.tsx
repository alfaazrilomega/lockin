import { getNoteById } from "@/lib/actions/note.actions"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NoteDetailsClient } from "@/components/notes/note-details-client"

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: note, error } = await getNoteById(id)

  if (error || !note) {
    redirect('/dashboard/notes')
  }

  return <NoteDetailsClient note={note} />
}
