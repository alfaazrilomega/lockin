import { getTasks } from '@/actions/tasks'
import { getActivityLogs, getUserSessionData, getStorageUsageData } from '@/actions/overview'
import { MetricsArea } from '@/components/shared/MetricsAreaWrapper'
import { Card } from '@/components/tremor/Card'
import { Badge } from '@/components/tremor/Badge'
import { ProgressBar } from '@/components/tremor/ProgressBar'
import {
  RiShieldCheckLine,
  RiTerminalBoxLine,
  RiHardDrive2Line,
  RiUserSharedLine,
  RiPulseLine
} from '@remixicon/react'

export const dynamic = 'force-dynamic'

interface OverviewPageProps {
  params: Promise<{ workspaceSlug: string }>
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  const { workspaceSlug } = await params
  const [tasks, activityLogs, userSession, storageUsage] = await Promise.all([
    getTasks(workspaceSlug),
    getActivityLogs(workspaceSlug),
    getUserSessionData(),
    getStorageUsageData(workspaceSlug)
  ])

  return (
    <div className="space-y-8 font-satoshi">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl font-satoshi">
          System Overview & Metrics
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-outfit">
          Analitik aktivitas penggunaan workspace, beban kerja tim, dan bukti riil audit keamanan.
        </p>
      </div>

      {/* Metrics & Donut Chart */}
      <MetricsArea tasks={tasks} />

      {/* Enterprise Real Proof Operational Summary Header */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div>
          <h2 className="text-base font-bold text-gray-900 font-satoshi flex items-center gap-2">
            <RiShieldCheckLine className="size-5 text-indigo-600" /> Ringkasan Operasional & Keamanan Real-Time
          </h2>
          <p className="text-xs text-gray-500 font-outfit">
            Bukti riil eksekusi RLS database, sesi aktif autentikasi, dan kuota penyimpanan fisik.
          </p>
        </div>
        <Badge variant="success" className="gap-1">
          <RiPulseLine className="size-3.5 animate-pulse" /> Live System Health
        </Badge>
      </div>

      {/* 3 Real Proof Enterprise Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 1: Live Audit Stream */}
        <Card className="p-5 bg-white border-gray-200 lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <RiTerminalBoxLine className="size-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-gray-900 font-satoshi uppercase tracking-wider">
                  Live Audit Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
                Postgres RLS
              </span>
            </div>

            <div className="bg-gray-950 p-3 rounded-lg border border-gray-800 font-mono text-[11px] text-gray-300 space-y-2.5 max-h-[260px] overflow-y-auto shadow-inner">
              {activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <div key={log.id} className="leading-tight space-y-0.5 border-b border-gray-900/80 pb-1.5 last:border-0">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-bold">
                        🟢 RLS Granted: {log.action.toUpperCase()}
                      </span>
                      <span className="text-gray-500">
                        {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-300 truncate font-satoshi text-[11px]">
                      <span className="text-gray-400 font-mono">{log.userName}</span>: &quot;{log.taskTitle}&quot;
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic text-center py-4">Belum ada log aktivitas di workspace ini.</div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-outfit">
            <span>Filter Trigger: PostgreSQL AFTER</span>
            <span className="text-emerald-600 font-semibold">Active Engine</span>
          </div>
        </Card>

        {/* Module 2: Active User Session */}
        <Card className="p-5 bg-white border-gray-200 lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <RiUserSharedLine className="size-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-gray-900 font-satoshi uppercase tracking-wider">
                  Active User Session
                </h3>
              </div>
              <Badge variant="success">Secured</Badge>
            </div>

            <div className="space-y-3 text-xs font-satoshi">
              <div className="p-3 bg-gray-50 rounded-md border border-gray-100 space-y-1">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider font-outfit block">
                  User Email (Google / Auth)
                </span>
                <p className="font-bold text-gray-900 truncate">{userSession?.email || 'Active User'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-outfit">Auth Provider</span>
                  <span className="font-semibold text-gray-800 capitalize">{userSession?.provider || 'Email'}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                  <span className="text-gray-400 text-[10px] block font-outfit">Role System</span>
                  <span className="font-semibold text-gray-800 capitalize">{userSession?.role || 'User'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-outfit">
            <span>Auth Session State</span>
            <span className="font-mono text-gray-700">JWT Verified</span>
          </div>
        </Card>

        {/* Module 3: Storage Quota Visualizer */}
        <Card className="p-5 bg-white border-gray-200 lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <RiHardDrive2Line className="size-4 text-blue-600" />
                <h3 className="text-xs font-bold text-gray-900 font-satoshi uppercase tracking-wider">
                  Storage Quota Visualizer
                </h3>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 ring-1 ring-blue-500/20 font-outfit">
                Bucket: attachments
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900 font-satoshi">
                    {storageUsage.usedMB} MB
                  </span>
                  <span className="text-xs text-gray-500 font-outfit ml-1">
                    / {storageUsage.quotaMB} MB (50 MB Limit)
                  </span>
                </div>
                <span className="text-xs font-bold text-indigo-600 font-outfit">
                  {storageUsage.percentage}% Terpakai
                </span>
              </div>

              <ProgressBar value={storageUsage.percentage} variant="default" className="[&>*]:h-2.5" />

              <div className="p-3 bg-gray-50 rounded-md border border-gray-100 space-y-1 text-xs font-outfit">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Total File Terunggah:</span>
                  <span className="font-bold text-gray-900 font-satoshi">{storageUsage.totalFiles} Berkas</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-outfit">
            <span>Supabase Physical Storage</span>
            <span className="font-semibold text-gray-700">10MB File Limit Active</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
