"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { TopNav } from "./top-nav"
import { type User as AppUser } from "@/lib/types"

interface DashboardClientShellProps {
  currentUser?: AppUser
  children: React.ReactNode
}

export function DashboardClientShell({ currentUser, children }: DashboardClientShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-satoshi relative">
      
      {/* 1. Mobile overlay (Darkened backdrop-blur to catch clicks) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 2. Sidebar (Fixed Drawer on Mobile, Static column on Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-muted border-r border-border
        flex flex-col shadow-2xl md:shadow-none
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar currentUser={currentUser} onMobileClose={() => setIsMobileOpen(false)} />
      </aside>

      {/* 3. Main Content Wrapper */}
      <div className="flex flex-col flex-1 w-full min-w-0 md:pl-64 h-full relative">
        <header className="sticky top-0 z-30 subtle-glass">
          <TopNav onMobileToggle={() => setIsMobileOpen((prev) => !prev)} currentUser={currentUser} />
        </header>

        <main className="flex-1 overflow-y-auto w-full">
          <div className="px-5 py-6 sm:px-8 sm:py-10 mx-auto w-full max-w-[900px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
