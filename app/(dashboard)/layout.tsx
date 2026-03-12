import { Sidebar } from "@/components/layout/sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { createClient } from "@/lib/supabase/server"
import { type User as AppUser } from "@/lib/types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
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
    <div className="grid h-screen w-full md:grid-cols-[250px_1fr] overflow-hidden bg-background text-foreground font-satoshi">
      <aside className="hidden md:flex flex-col border-r border-border bg-muted">
        <Sidebar currentUser={currentUser} />
      </aside>

      <main className="flex flex-col h-full overflow-y-auto relative">
        <header className="sticky top-0 z-10 subtle-glass">
          <TopNav />
        </header>
        <div className="flex-1 p-8 mx-auto w-full max-w-[900px]">
          {children}
        </div>
      </main>
    </div>
  )
}
