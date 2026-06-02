export default function Page() { return null; }

export const dynamic = 'force-dynamic'

// Tell Next.js not to attempt static generation of any job pages at build time
export function generateStaticParams() {
  return []
}

interface Props {
  params: Promise<{ jobId: string }>
}

export default async function JobDetailPage({ params }: Props) {
  const { jobId } = await params
  const job = await getJob(jobId)
  if (!job) notFound()

  const scores = job.validation_scores

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-[#1e1e2e] sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <a href="/jobs" className="text-[#475569] hover:text-[#e2e8f0] transition-colors text-sm">
            ← Jobs
          </a>
          <StatusBadge status={job.status} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#e2e8f0]">
            {job.script_title || job.title_idea || 'Untitled Job'}
          </h1>
          <p className="text-sm text-[#475569] mt-1">{formatDate(job.created_at)}</p>
        </div>

        {/* Pipeline Progress */}
        <div className="glass rounded-2xl p-6">
          <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-4">
            Pipeline Progress
          </p>
          <PipelineStepper status={job.status} />
          {job.revision_notes && (
            <div className="mt-4 p-3 rounded-xl bg-[#f9731608] border border-[#f9731622]">
              <p className="text-xs text-[#f97316] font-semibold mb-1">Revision Notes</p>
              <p className="text-xs text-[#94a3b8]">{job.revision_notes}</p>
            </div>
          )}
        </div>

        {/* Thumbnail preview */}
        {job.thumbnail_url && (
          <div className="glass rounded-2xl p-6">
            <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-4">
              Thumbnail
            </p>
            <img
              src={job.thumbnail_url}
              alt="Thumbnail"
              className="w-full rounded-xl object-cover"
              style={{ maxHeight: 280, objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Video details */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Genre */}
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-3">Genre</p>
            <div className="flex gap-2 flex-wrap">
              {job.primary_genre && (
                <span className="badge" style={{ color: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  {job.primary_genre}
                </span>
              )}
              {job.secondary_genre && (
                <span className="badge" style={{ color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
                  {job.secondary_genre}
                </span>
              )}
            </div>
          </div>

          {/* Validation Scores */}
          {scores && (
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-3">
                Quality Scores
              </p>
              <div className="space-y-2">
                {Object.entries(scores).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-[10px] text-[#475569] w-28 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#1e1e2e] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${val}%`,
                          background: val >= 70
                            ? 'linear-gradient(90deg, #6366f1, #22d3a0)'
                            : val >= 40
                            ? '#f59e0b'
                            : '#ef4444',
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-[#94a3b8] w-8 text-right">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Asset Links */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider">Assets</p>
          {[
            { label: '🎬 Video', url: job.video_url },
            { label: '🎤 Audio', url: job.audio_url },
            { label: '🖼️ Thumbnail', url: job.thumbnail_url },
            { label: '▶️ YouTube', url: job.youtube_url },
          ].map(({ label, url }) =>
            url ? (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-2 border-b border-[#111118] last:border-0 group"
              >
                <span className="text-xs text-[#94a3b8]">{label}</span>
                <span className="text-xs text-[#6366f1] group-hover:text-[#818cf8] truncate max-w-xs transition-colors">
                  {url}
                </span>
              </a>
            ) : null
          )}
        </div>

        {/* Published info */}
        {job.published_at && (
          <div className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: 'rgba(34,211,160,0.06)', border: '1px solid rgba(34,211,160,0.15)' }}>
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-sm font-semibold text-[#22d3a0]">Published Successfully</p>
              <p className="text-xs text-[#475569] mt-0.5">{formatDate(job.published_at)}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
