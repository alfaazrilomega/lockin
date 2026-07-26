import { getTasks } from '@/actions/tasks'
import { AuditDetailsTable } from './audit-details-table'

export const dynamic = 'force-dynamic'

interface DetailsPageProps {
  params: Promise<{ workspaceSlug: string }>
}

export default async function DetailsPage({ params }: DetailsPageProps) {
  const { workspaceSlug } = await params
  const tasks = await getTasks(workspaceSlug)

  return (
    <div className="space-y-6 font-satoshi">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl font-satoshi">
          Task Audit Details & Time-Travel History
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-outfit">
          Tabel rincian tugas komprehensif. Klik baris mana saja untuk membuka drawer sejarah waktu (*Time-Travel Audit*) PostgreSQL.
        </p>
      </div>

      <AuditDetailsTable tasks={tasks as any} />
    </div>
  )
}
