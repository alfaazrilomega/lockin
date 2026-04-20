"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { type Notification } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCheck, Loader2, Info } from "lucide-react"
import { formatDate } from "@/lib/utils"

const TYPE_COLORS: Record<string, string> = {
  TASK_ASSIGNED: "bg-blue-500/10 text-blue-500",
  TASK_REVIEW: "bg-purple-500/10 text-purple-500",
  TASK_APPROVED: "bg-green-500/10 text-green-500",
  TASK_REVISION: "bg-orange-500/10 text-orange-500",
  SHARE_RECEIVED: "bg-primary/10 text-primary",
  AI_DIGEST: "bg-amber-500/10 text-amber-500",
  SYSTEM: "bg-muted text-muted-foreground",
  default: "bg-muted text-muted-foreground",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications", { withCredentials: true })
      if (res.data.success) setNotifications(res.data.data)
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotifications() }, [])

  const handleMarkRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}`, { isRead: true })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      console.error("Mark read failed:", err)
    }
  }

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead)
    await Promise.all(unread.map(n => handleMarkRead(n.id)))
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-satoshi">
            Notifications
          </h1>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "You're all caught up."}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-foreground">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You&apos;ll be notified here when something needs your attention.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                n.isRead ? "border-border bg-muted/5 opacity-70" : "border-border bg-background hover:border-primary/30"
              }`}
            >
              <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${TYPE_COLORS[n.type] ?? TYPE_COLORS.default}`}>
                <Info className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium ${n.isRead ? "text-muted-foreground" : "text-foreground"}`}>
                    {n.title}
                  </p>
                  <span className="text-xs text-muted-foreground shrink-0">{formatDate(n.createdAt)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="shrink-0 text-xs text-primary hover:underline"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
