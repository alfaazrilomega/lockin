"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Settings,
  Bell,
  CheckSquare,
  Brain,
  Paperclip,
} from "lucide-react"

import { Logo } from "@/components/shared/Logo"

interface SidebarProps {
  onMobileClose?: () => void
}

export function Sidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname()

  // Dribbble grouped navigation style
  const navigationGroups = [
    {
      title: "Main",
      items: [
        { icon: LayoutDashboard, name: "Dashboard", href: "/dashboard" },
        { icon: Calendar, name: "Calendar", href: "/dashboard/calendar" },
        { icon: Users, name: "Projects", href: "/dashboard/projects" },
      ]
    },
    {
      title: "Workspace",
      items: [
        { icon: CheckSquare, name: "My Tasks", href: "/dashboard/personal-tasks" },
        { icon: FileText, name: "Notes", href: "/dashboard/notes" },
        { icon: Brain, name: "Flashcards", href: "/dashboard/flashcards" },
        { icon: Paperclip, name: "Files", href: "/dashboard/files" },
      ]
    },
    {
      title: "System",
      items: [
        { icon: Bell, name: "Notifications", href: "/dashboard/notifications" },
        { icon: Settings, name: "Settings", href: "/dashboard/settings" },
      ]
    }
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="flex items-center justify-center p-4 border-b border-gray-100 flex-shrink-0">
        <Logo className="size-8" />
      </div>

      {/* Navigation (Icon Only) */}
      <nav className="flex-1 overflow-y-auto py-6 items-center flex flex-col no-scrollbar">
        <div className="flex flex-col w-full px-3">
          {navigationGroups.map((group, groupIndex) => (
            <div key={group.title} className="flex flex-col items-center w-full">
               {groupIndex > 0 && <div className="w-8 border-t border-gray-100 my-4" />}
               <ul className="space-y-3 w-full flex flex-col items-center">
                 {group.items.map((item) => {
                   const isActive = item.href === '/dashboard'
                     ? pathname === item.href
                     : pathname === item.href || pathname?.startsWith(`${item.href}/`)

                   return (
                     <li key={item.name} className="w-full flex justify-center">
                       <Link
                         href={item.href}
                         onClick={onMobileClose}
                         title={item.name}
                         className={`
                           flex items-center justify-center p-3 rounded-[14px] transition-all duration-300 ease-in-out
                           ${isActive
                             ? "bg-[#E83D69] text-white shadow-[0_4px_12px_rgba(232,61,105,0.3)] transform hover:scale-[1.05]"
                             : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"}
                         `}
                       >
                         <item.icon className="h-[20px] w-[20px] stroke-[2.5px]" />
                       </Link>
                     </li>
                   )
                 })}
               </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Removed User Section */}
    </div>
  )
}