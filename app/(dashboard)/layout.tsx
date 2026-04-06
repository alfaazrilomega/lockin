import { DashboardClientShell } from "@/components/layout/dashboard-client-shell"
import { createClient } from "@/lib/supabase/server"
import { type User as AppUser } from "@/lib/types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const currentUser: AppUser | undefined = user ? {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    avatarUrl: user.user_metadata?.avatar_url || null,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at || user.created_at)
  } : undefined

  return (
    <DashboardClientShell currentUser={currentUser}>
      {children}
    </DashboardClientShell>
  )
}
