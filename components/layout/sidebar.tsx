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
  Menu,
  LogOut
} from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  currentUser?: User
}

export function Sidebar({ currentUser }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    { icon: LayoutDashboard, name: "Dashboard", href: "/dashboard" },
    { icon: Calendar, name: "Calendar", href: "/dashboard/calendar" },
    { icon: FileText, name: "Notes", href: "/dashboard/notes" },
    { icon: Users, name: "Projects", href: "/dashboard/projects" },
    { icon: Settings, name: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">LockIn</h1>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-5 w-5 text-foreground" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
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
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 px-2 py-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              {currentUser?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentUser?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser?.email || 'user@example.com'}</p>
            </div>
            <button className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
    </div>
  )
}