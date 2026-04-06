import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProjectDetailClientViewer } from "@/components/projects/ProjectDetailClientViewer"

export default async function ProjectDetailPage({
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

  return <ProjectDetailClientViewer projectId={id} />
}
