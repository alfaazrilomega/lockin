"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Bell,
  User,
  Menu,
  Settings,
  LogOut,
  CheckCheck,
  Info,
} from "lucide-react"
import { type User as AppUser, type Notification } from "@/lib/types"
import { createClientComponentClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import axios from "axios"
import Link from "next/link"

interface TopNavProps {
  onMobileToggle: () => void
  currentUser?: AppUser
}

export function TopNav({ onMobileToggle, currentUser }: TopNavProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notifOpen, setNotifOpen] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get("/api/notifications", { withCredentials: true })
      if (res.data.success) setNotifications(res.data.data)
    } catch { /* silently ignore */ }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60_000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const unreadCount = notifications.filter(n => !n.isRead).length
  const previewList = notifications.slice(0, 5)

  const handleMarkRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}`, { isRead: true })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch { /* ignore */ }
  }

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead)
    await Promise.all(unread.map(n => handleMarkRead(n.id)))
  }

  const handleSignOut = async () => {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex items-center justify-between h-16 px-6 border-b border-border bg-white/80 backdrop-blur-md">
      {/* Left Section - Mobile Toggle & Search */}
      <div className="flex items-center space-x-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={onMobileToggle}
        >
          <Menu className="h-5 w-5 text-foreground" />
        </Button>

        {/* Global Search (Mondays Style) */}
        <div className="hidden md:flex relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search or type a command"
            className="pl-9 pr-12 py-2.5 w-full bg-gray-100/50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#E83D69]/20 text-sm font-medium text-gray-900 placeholder:text-gray-400 transition-all"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500 shadow-sm border border-gray-200">
              <span className="text-xs">⌘</span>F
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Section - Actions & Profile */}
      <div className="flex items-center space-x-4 shrink-0">
        
        {/* New Project Button (Dribbble Dark Pill style mapping) */}
        <Button className="hidden md:flex rounded-full bg-gray-900 text-white hover:bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.1)] px-5 font-semibold tracking-tight h-9">
          + New Project
        </Button>
        {/* Notification bell */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-muted rounded-lg relative">
              <Bell className="h-5 w-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 mr-4 mt-2 overflow-hidden" align="end">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <Badge className="h-4 px-1.5 text-[10px] bg-primary/10 text-primary border-primary/20">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="h-3 w-3" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-border">
              {previewList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                  <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                previewList.map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 flex items-start gap-3 ${!n.isRead ? "bg-primary/5" : ""}`}
                  >
                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Info className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground leading-snug line-clamp-1">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                    </div>
                    {!n.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-2.5">
              <Link
                href="/dashboard/notifications"
                className="text-xs text-primary hover:underline"
                onClick={() => setNotifOpen(false)}
              >
                View all notifications →
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-muted rounded-full">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-border transition-all hover:ring-primary/50 overflow-hidden">
                {currentUser?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentUser.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  currentUser?.name?.[0]?.toUpperCase() || "U"
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">{currentUser?.name || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
