import { Suspense } from 'react'
import { getRecentJobs, getPipelineStats } from '@/lib/supabase'
import { StatCard } from '@/components/StatCard'
import { JobCard } from '@/components/JobCard'

// Force dynamic so stats are always fresh
export const dynamic = 'force-dynamic'
export const revalidate = 30 // revalidate every 30s

// ── Next run countdown helper ──────────────────────────────
function getNextRunTime(): string {
  const now = new Date()
  const next = new Date()
  next.setUTCHours(1, 0, 0, 0) // 08:00 WIB = 01:00 UTC
  if (now >= next) next.setDate(next.getDate() + 1)
  const diff = next.getTime() - now.getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return `${h}h ${m}m`
}

// ── Main Dashboard Page ───────────────────────────────────
export default async function DashboardPage() {
  const [stats, jobs] = await Promise.all([
    getPipelineStats(),
    getRecentJobs(12),
  ])

  const successRate = stats.total > 0
    ? Math.round((stats.published / stats.total) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#22d3a0] flex items-center justify-center text-sm font-bold">
              AI
            </div>
            <div>
              <h1 className="font-bold text-[#e2e8f0] text-sm leading-none">LockIn AI</h1>
              <p className="text-[10px] text-[#475569] mt-0.5">YouTube Automation</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <div className="relative w-2 h-2">
                <div className="w-2 h-2 rounded-full bg-[#22d3a0]" />
                <div className="absolute inset-0 rounded-full bg-[#22d3a0] animate-ping opacity-40" />
              </div>
              <span className="text-xs text-[#22d3a0] font-medium">Pipeline Active</span>
            </div>

            {/* Next run */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#16161f] border border-[#1e1e2e]">
              <span className="text-[10px] text-[#475569]">Next Run</span>
              <span className="text-xs font-semibold text-[#6366f1]">{getNextRunTime()}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Hero Banner ──────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(34,211,160,0.06) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge" style={{ color: '#22d3a0', backgroundColor: 'rgba(34,211,160,0.1)', border: '1px solid rgba(34,211,160,0.2)' }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22d3a0]" />
                100% Automated
              </span>
              <span className="badge" style={{ color: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                Gemini 3.5 Flash
              </span>
              <span className="badge" style={{ color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                Veo Video Gen
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#e2e8f0]">
              AI YouTube Pipeline{' '}
              <span className="gradient-text">Command Center</span>
            </h2>
            <p className="text-sm text-[#64748b] mt-2 max-w-lg">
              Fully autonomous: Research → Create → Validate → Publish.
              One video every day at 08:00 WIB, no human needed.
            </p>
          </div>
        </div>

        {/* ── Stats Grid ───────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Jobs"
            value={stats.total}
            icon="📊"
            color="#6366f1"
            glow="rgba(99,102,241,0.08)"
          />
          <StatCard
            label="Published"
            value={stats.published}
            icon="🚀"
            color="#22d3a0"
            glow="rgba(34,211,160,0.08)"
          />
          <StatCard
            label="Success Rate"
            value={successRate}
            icon="🎯"
            color="#f59e0b"
            suffix="%"
          />
          <StatCard
            label="In Progress"
            value={stats.pending}
            icon="⚙️"
            color="#38bdf8"
          />
        </div>

        {/* ── Pipeline Flow Visual ─────────────────────────── */}
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-4">
            Daily Pipeline Flow
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: '🔍', name: 'Research', desc: 'Trends + AI picks', color: '#f59e0b' },
              { icon: '🎬', name: 'Create',   desc: 'Veo + Kokoro TTS', color: '#6366f1' },
              { icon: '✅', name: 'Validate', desc: 'Genre + Quality',   color: '#38bdf8' },
              { icon: '🚀', name: 'Publish',  desc: 'YouTube + SEO',    color: '#22d3a0' },
            ].map((phase, i, arr) => (
              <div key={phase.name} className="flex items-center gap-2">
                <div className="flex-1 rounded-xl p-3 text-center"
                  style={{ backgroundColor: `${phase.color}0d`, border: `1px solid ${phase.color}22` }}>
                  <div className="text-xl mb-1">{phase.icon}</div>
                  <p className="text-xs font-semibold" style={{ color: phase.color }}>{phase.name}</p>
                  <p className="text-[10px] text-[#475569] mt-0.5">{phase.desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-[#1e1e2e] text-lg flex-shrink-0">›</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Jobs ──────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#e2e8f0]">Recent Jobs</h2>
            <a href="/jobs" className="text-xs text-[#6366f1] hover:text-[#818cf8] transition-colors font-medium">
              View all →
            </a>
          </div>

          {jobs.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-4xl mb-3">🤖</div>
              <p className="text-[#475569] text-sm">No jobs yet — pipeline will run at 08:00 WIB</p>
              <p className="text-[#2d3748] text-xs mt-1">
                Make sure n8n is running and credentials are configured
              </p>
            </div>
          ) : (
            <Suspense fallback={<div className="text-[#475569] text-sm">Loading jobs...</div>}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </Suspense>
          )}
        </div>

        {/* ── Setup Checklist (shown when no jobs yet) ─────── */}
        {jobs.length === 0 && (
          <div className="glass rounded-2xl p-6">
            <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-4">
              Setup Checklist
            </p>
            <div className="space-y-2">
              {[
                { step: 'Oracle Cloud VM running', done: false },
                { step: 'n8n deployed via Docker', done: false },
                { step: 'Gemini API key configured', done: false },
                { step: 'YouTube OAuth connected', done: false },
                { step: 'Supabase tables created', done: true },
                { step: 'Cloudflare R2 bucket ready', done: false },
                { step: 'n8n workflows imported', done: false },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-3 py-2 border-b border-[#111118] last:border-0">
                  <span className={`text-sm ${item.done ? 'text-[#22d3a0]' : 'text-[#1e1e2e]'}`}>
                    {item.done ? '✓' : '○'}
                  </span>
                  <span className={`text-xs ${item.done ? 'text-[#22d3a0]' : 'text-[#475569]'}`}>
                    {item.step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
