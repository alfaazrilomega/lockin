import { getWorkspaceData } from '@/actions/workspace'
import { Card } from '@/components/tremor/Card'
import { Badge } from '@/components/tremor/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/tremor/Table'
import { InviteMemberModal } from './invite-member-modal'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface SettingsUsersPageProps {
  params: Promise<{ workspaceSlug: string }>
}

export default async function SettingsUsersPage({ params }: SettingsUsersPageProps) {
  const { workspaceSlug } = await params
  const workspace = await getWorkspaceData(workspaceSlug)
  const isOwner = workspace.userRole === 'owner'

  return (
    <div className="space-y-6 font-satoshi">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl font-satoshi">
            Anggota Tim & Hak Akses
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-outfit">
            Kelola anggota tim HR yang memiliki akses kolaborasi di workspace ini.
          </p>
        </div>

        {/* RBAC Gate: Only show Invite Member button for Owners */}
        {isOwner ? (
          <InviteMemberModal />
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-600 font-outfit border border-gray-200">
            Read-Only Member View
          </span>
        )}
      </div>

      {/* Navigation Sub-Menu with dynamic workspaceSlug */}
      <div className="flex gap-4 border-b border-gray-200 pb-3 text-xs font-semibold">
        <Link href={`/${workspace.slug}/dashboard/settings`} className="text-gray-500 hover:text-gray-900 font-outfit transition">
          General
        </Link>
        <Link href={`/${workspace.slug}/dashboard/settings/users`} className="text-indigo-600 border-b-2 border-indigo-600 pb-3 -mb-3 font-outfit">
          Anggota Tim
        </Link>
        <Link href={`/${workspace.slug}/dashboard/settings/billing`} className="text-gray-500 hover:text-gray-900 font-outfit transition">
          Billing & Usage
        </Link>
      </div>

      <Card className="p-0 overflow-hidden border-gray-200 bg-white">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Nama / Email Anggota</TableHeaderCell>
              <TableHeaderCell>Peran (Role)</TableHeaderCell>
              <TableHeaderCell>Status Sesi</TableHeaderCell>
              <TableHeaderCell>Tanggal Bergabung</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workspace.members && workspace.members.length > 0 ? (
              workspace.members.map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="font-bold text-gray-900 font-satoshi">
                      {(member as any).displayName || member.user?.full_name || 'Anggota Tim'}
                    </div>
                    <div className="text-[11px] text-indigo-600 font-mono">
                      {(member as any).displayEmail || member.invited_email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'owner' ? 'success' : 'neutral'} className="uppercase font-outfit">
                      {member.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                      {member.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 font-outfit text-xs">
                    {new Date(member.joined_at).toLocaleDateString('id-ID')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 italic py-6">
                  Belum ada anggota lain di workspace ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
