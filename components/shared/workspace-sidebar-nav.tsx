"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  RiHome2Line,
  RiPieChartLine,
  RiListCheck,
  RiSettings5Line,
  RiChat3Line,
  RiBookOpenLine
} from '@remixicon/react'

interface WorkspaceSidebarNavProps {
  workspaceSlug: string
}

export function WorkspaceSidebarNav({ workspaceSlug }: WorkspaceSidebarNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Task Workspace',
      href: `/${workspaceSlug}/dashboard`,
      icon: RiHome2Line,
      exact: true,
    },
    {
      name: 'AI Meeting Notes',
      href: `/${workspaceSlug}/dashboard/meetings`,
      icon: RiChat3Line,
      exact: false,
    },
    {
      name: 'Granola AI Recipes',
      href: `/${workspaceSlug}/dashboard/recipes`,
      icon: RiBookOpenLine,
      exact: false,
    },
    {
      name: 'Overview & Chart',
      href: `/${workspaceSlug}/dashboard/overview`,
      icon: RiPieChartLine,
      exact: false,
    },
    {
      name: 'Audit Details',
      href: `/${workspaceSlug}/dashboard/details`,
      icon: RiListCheck,
      exact: false,
    },
    {
      name: 'Settings & Team',
      href: `/${workspaceSlug}/dashboard/settings`,
      icon: RiSettings5Line,
      exact: false,
    },
  ]

  return (
    <div>
      <span className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider font-outfit">
        Menu Utama
      </span>
      <ul role="list" className="mt-2 space-y-1.5">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || (pathname?.startsWith(`${item.href}/`) ?? false)

          const Icon = item.icon

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`group flex items-center gap-x-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-xs border-l-4 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                }`}
              >
                <Icon className={`size-4 shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span>{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
