"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"

export function SidebarWrapper() {
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
        w-20 bg-white border-r border-gray-100
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar onMobileClose={() => setIsMobileOpen(false)} />
      </aside>
    </>
  )
}
