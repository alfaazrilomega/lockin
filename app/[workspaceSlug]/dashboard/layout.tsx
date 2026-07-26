import { ReactNode } from 'react'
import Link from 'next/link'
import { logout } from '@/actions/auth'
import { getWorkspaceData, getUserWorkspaces, getPendingUserInvitations } from '@/actions/workspace'
import { getUserSessionData } from '@/actions/overview'
import { WorkspaceSwitcher } from '@/components/shared/workspace-switcher'
import { PendingInvitationBanner } from '@/components/shared/pending-invitation-banner'
import {
  RiHome2Line,
  RiPieChartLine,
  RiListCheck,
  RiSettings5Line,
  RiShieldCheckLine,
  RiLogoutBoxRLine,
  RiCheckDoubleLine,
  RiUser3Line,
  RiChat3Line,
  RiBookOpenLine
} from '@remixicon/react'

export const dynamic = 'force-dynamic'

interface DashboardLayoutProps {
  children: ReactNode
  params: Promise<{ workspaceSlug: string }>
}

async function SidebarContent({ workspaceSlug }: { workspaceSlug: string }) {
  const [workspace, userWorkspaces, userSession] = await Promise.all([
    getWorkspaceData(workspaceSlug),
    getUserWorkspaces(),
    getUserSessionData()
  ])

  return (
    <aside className="flex grow flex-col gap-y-6 overflow-y-auto border-r border-gray-200 bg-white p-4 font-satoshi">
      {/* Global Workspace Switcher Dropdown */}
      <WorkspaceSwitcher
        currentWorkspace={{
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          userRole: workspace.userRole
        }}
        userWorkspaces={userWorkspaces}
      />

      {/* Main Navigation Links */}
      <nav aria-label="core navigation" className="flex flex-1 flex-col space-y-6">
        <div>
          <span className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider font-outfit">
            Menu Utama
          </span>
          <ul role="list" className="mt-2 space-y-1">
            <li>
              <Link
                href={`/${workspace.slug}/dashboard`}
                className="flex items-center gap-x-2.5 rounded-md px-2.5 py-2 text-xs font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition"
              >
                <RiHome2Line className="size-4 shrink-0 text-indigo-600" />
                <span>Task Workspace</span>
              </Link>
            </li>
            <li>
              <Link
                href={`/${workspace.slug}/dashboard/meetings`}
                className="flex items-center gap-x-2.5 rounded-md px-2.5 py-2 text-xs font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition"
              >
                <RiChat3Line className="size-4 shrink-0 text-indigo-600" />
                <span>AI Meeting Notes</span>
              </Link>
            </li>
            <li>
              <Link
                href={`/${workspace.slug}/dashboard/recipes`}
                className="flex items-center gap-x-2.5 rounded-md px-2.5 py-2 text-xs font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition"
              >
                <RiBookOpenLine className="size-4 shrink-0 text-amber-500" />
                <span>Granola AI Recipes</span>
              </Link>
            </li>
            <li>
              <Link
                href={`/${workspace.slug}/dashboard/overview`}
                className="flex items-center gap-x-2.5 rounded-md px-2.5 py-2 text-xs font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition"
              >
                <RiPieChartLine className="size-4 shrink-0 text-gray-500" />
                <span>Overview & Chart</span>
              </Link>
            </li>
            <li>
              <Link
                href={`/${workspace.slug}/dashboard/details`}
                className="flex items-center gap-x-2.5 rounded-md px-2.5 py-2 text-xs font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition"
              >
                <RiListCheck className="size-4 shrink-0 text-gray-500" />
                <span>Audit Details</span>
              </Link>
            </li>
            <li>
              <Link
                href={`/${workspace.slug}/dashboard/settings`}
                className="flex items-center gap-x-2.5 rounded-md px-2.5 py-2 text-xs font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition"
              >
                <RiSettings5Line className="size-4 shrink-0 text-gray-500" />
                <span>Settings & Team</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Security & System Features */}
        <div>
          <span className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider font-outfit">
            Keamanan Sistem
          </span>
          <ul role="list" className="mt-2 space-y-1">
            <li>
              <div className="flex items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-x-2">
                  <RiShieldCheckLine className="size-4 shrink-0 text-emerald-600" />
                  <span>Zero Trust RLS</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* User Session Profile & Sign Out Footer */}
      <div className="mt-auto border-t border-gray-100 pt-4 space-y-2">
        <div className="flex items-center gap-2.5 px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
          <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-bold font-outfit">
            <RiUser3Line className="size-4 text-indigo-600" />
          </div>
          <div className="flex-1 truncate">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-outfit leading-tight">Akun Login</p>
            <p className="text-xs font-bold text-gray-900 truncate font-satoshi">{userSession?.email || 'Akun Pengguna'}</p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-x-2 rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <RiLogoutBoxRLine className="size-4 shrink-0" />
            <span>Keluar Akun</span>
          </button>
        </form>
      </div>
    </aside>
  )
}

async function TopNavHeader({ workspaceSlug }: { workspaceSlug: string }) {
  const workspace = await getWorkspaceData(workspaceSlug)

  return (
    <div className="flex h-14 items-center justify-between px-6 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 font-outfit">
        <span>Workspace</span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-gray-900">{workspace.name}</span>
        <span className="text-gray-300">/</span>
        <span className="font-mono text-indigo-600 text-[11px]">[{workspace.slug}]</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 font-outfit">
          <RiCheckDoubleLine className="size-3.5 text-emerald-600" />
          Database RLS Protected
        </span>
      </div>
    </div>
  )
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { workspaceSlug } = await params
  const pendingInvitations = await getPendingUserInvitations()

  return (
    <div className="grid h-screen w-full md:grid-cols-[260px_1fr] overflow-hidden bg-gray-50 text-gray-900 font-satoshi">
      <div className="hidden md:flex flex-col">
        <SidebarContent workspaceSlug={workspaceSlug} />
      </div>

      <main className="flex flex-col h-full overflow-y-auto relative bg-gray-50">
        <header className="sticky top-0 z-10">
          <TopNavHeader workspaceSlug={workspaceSlug} />
        </header>
        <div className="flex-1 px-8 py-8 mx-auto w-full max-w-[1050px]">
          <PendingInvitationBanner invitations={pendingInvitations} />
          {children}
        </div>
      </main>
    </div>
  )
}
