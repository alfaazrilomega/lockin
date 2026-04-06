import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NotesClientViewer } from "@/components/notes/NotesClientViewer"

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // The Server Component merely passes authentication or basic Layout shells.
  // The actual fetching, state management, and UI logic happens in our isolated Client Component.
  return (
    <NotesClientViewer />
  )
}
