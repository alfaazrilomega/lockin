'use client'

import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiBuilding2Line
} from '@remixicon/react'

export interface UserWorkspaceItem {
  id: string
  name: string
  slug: string
  owner_id: string
  userRole: 'owner' | 'member'
}

interface WorkspaceSwitcherProps {
  currentWorkspace: {
    id: string
    name: string
    slug: string
    userRole: 'owner' | 'member'
  }
  userWorkspaces: UserWorkspaceItem[]
}

export function WorkspaceSwitcher({ currentWorkspace, userWorkspaces }: WorkspaceSwitcherProps) {
  const activeSlug = currentWorkspace.slug

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition cursor-pointer font-satoshi shadow-xs group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/img/logo.png"
              alt="Workspace Logo"
              className="h-10 w-auto object-contain flex-shrink-0"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 pl-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/20 uppercase tracking-wider font-outfit">
              {currentWorkspace.userRole.toUpperCase()}
            </span>
            <RiArrowDownSLine className="size-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[230px] bg-white border border-gray-200 shadow-lg font-satoshi z-50 p-1.5 space-y-1"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider font-outfit flex items-center gap-1.5">
          <RiBuilding2Line className="size-3.5 text-gray-400" /> Ruang Kerja Saya
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100 my-1" />

        <div className="space-y-1 max-h-[240px] overflow-y-auto">
          {userWorkspaces.map((ws) => {
            const isCurrentActive = ws.slug === activeSlug

            return (
              <DropdownMenuItem
                key={ws.id}
                disabled={isCurrentActive}
                onClick={() => {
                  if (!isCurrentActive) {
                    window.location.href = `/${ws.slug}/dashboard`
                  }
                }}
                className={`flex items-center justify-between p-2 rounded-md text-xs font-semibold transition cursor-pointer ${
                  isCurrentActive
                    ? 'opacity-60 cursor-not-allowed bg-indigo-50/60 border-l-2 border-indigo-600 text-gray-900'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`h-6 w-6 rounded flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                      isCurrentActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-xs leading-tight">{ws.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono truncate">/{ws.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {isCurrentActive ? (
                    <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-0.5 font-outfit">
                      <RiCheckLine className="size-3.5 text-indigo-600" /> Aktif
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-gray-100 text-gray-500 uppercase font-outfit">
                      {ws.userRole}
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
