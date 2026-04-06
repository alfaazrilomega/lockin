"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { type User } from "@/lib/types"

interface SidebarWrapperProps {
  currentUser?: User
}

export function SidebarWrapper({ currentUser }: SidebarWrapperProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed md:relative inset-y-0 left-0 z-30
        w-[250px] bg-muted border-r border-border
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar currentUser={currentUser} onMobileClose={() => setIsMobileOpen(false)} />
      </aside>
    </>
  )
}
