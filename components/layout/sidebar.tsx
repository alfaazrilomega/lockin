"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type User } from "@/lib/types"
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Settings,
  LogOut,
  User as UserIcon,
  ChevronsUpDown
} from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SidebarProps {
  currentUser?: User
  onMobileClose?: () => void
}

export function Sidebar({ currentUser, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const navigationItems = [
    { icon: LayoutDashboard, name: "Dashboard", href: "/dashboard" },
    { icon: Calendar, name: "Calendar", href: "/dashboard/calendar" },
    { icon: FileText, name: "Notes", href: "/dashboard/notes" },
    { icon: Users, name: "Projects", href: "/dashboard/projects" },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">LockIn</h1>
        {onMobileClose && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMobileClose}
          >
            <LogOut className="h-5 w-5 text-foreground" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === item.href 
              : pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onMobileClose}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-border mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer transition-colors outline-none focus:ring-2 focus:ring-primary/50">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-transparent transition-all hover:ring-primary/50 overflow-hidden shrink-0">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    currentUser?.name?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-foreground truncate">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser?.email || 'user@example.com'}</p>
                </div>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuItem className="cursor-pointer" onClick={() => { router.push('/dashboard'); onMobileClose?.(); }}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => { router.push('/dashboard/settings'); onMobileClose?.(); }}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/50 dark:focus:text-red-500" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}