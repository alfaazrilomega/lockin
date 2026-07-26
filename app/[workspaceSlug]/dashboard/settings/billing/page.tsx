import { Card } from '@/components/tremor/Card'
import { Badge } from '@/components/tremor/Badge'
import { ProgressBar } from '@/components/tremor/ProgressBar'
import { getWorkspaceData } from '@/actions/workspace'
import { getStorageUsageData } from '@/actions/overview'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface SettingsBillingPageProps {
  params: Promise<{ workspaceSlug: string }>
}

export default async function SettingsBillingPage({ params }: SettingsBillingPageProps) {
  const { workspaceSlug } = await params
  const [workspace, storageUsage] = await Promise.all([
    getWorkspaceData(workspaceSlug),
    getStorageUsageData(workspaceSlug)
  ])

  return (
    <div className="space-y-6 font-satoshi">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl font-satoshi">
          Billing & Spend Control
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-outfit">
          Kelola paket langganan, batasan kuota storage, dan informasi penagihan.
        </p>
      </div>

      {/* Navigation Sub-Menu */}
      <div className="flex gap-4 border-b border-gray-200 pb-3 text-xs font-semibold">
        <Link href={`/${workspace.slug}/dashboard/settings`} className="text-gray-500 hover:text-gray-900 font-outfit transition">
          General
        </Link>
        <Link href={`/${workspace.slug}/dashboard/settings/users`} className="text-gray-500 hover:text-gray-900 font-outfit transition">
          Anggota Tim
        </Link>
        <Link href={`/${workspace.slug}/dashboard/settings/billing`} className="text-indigo-600 border-b-2 border-indigo-600 pb-3 -mb-3 font-outfit">
          Billing & Usage
        </Link>
      </div>

      {/* Plan Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Paket Langganan Saat Ini</h3>
            <Badge variant="success" className="font-outfit">PRO PLAN</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900">$0.00 / bulan</div>
          <p className="text-xs text-gray-500 font-outfit">
            Akses penuh ke Zero Trust RLS, Supabase Storage Attachment, dan Kanban Realtime.
          </p>
        </Card>

        <Card className="p-6 bg-white border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Penggunaan Penyimpanan File</h3>
            <span className="text-xs font-semibold text-gray-500 font-outfit">
              {storageUsage.usedMB} MB / {storageUsage.quotaMB} MB Limit
            </span>
          </div>
          <ProgressBar value={storageUsage.percentage} variant="default" className="[&>*]:h-2" />
          <p className="text-[11px] text-gray-500 font-outfit">
            Bucket Supabase Storage: <code className="font-mono text-gray-700">attachments</code> ({storageUsage.totalFiles} berkas terunggah)
          </p>
        </Card>
      </div>
    </div>
  )
}
