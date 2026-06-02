import { getRecentJobs } from '@/lib/supabase'
import { JobCard } from '@/components/JobCard'

export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const jobs = await getRecentJobs(50)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-[#1e1e2e] sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <a href="/" className="text-[#475569] hover:text-[#e2e8f0] transition-colors text-sm">
            ← Back
          </a>
          <h1 className="font-bold text-[#e2e8f0]">All Jobs</h1>
          <span className="text-xs text-[#475569]">({jobs.length} total)</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {jobs.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-[#475569]">No jobs found. Pipeline hasn&apos;t run yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
