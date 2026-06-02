'use client'

import Link from 'next/link'
import { PipelineJob } from '@/lib/supabase'
import { StatusBadge } from './StatusBadge'
import { PipelineStepper } from './PipelineStepper'
import { timeAgo } from '@/lib/utils'

interface JobCardProps {
  job: PipelineJob
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.job_id}`}>
      <div className="glass card-hover rounded-2xl p-5 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-[#e2e8f0] truncate group-hover:text-[#a5b4fc] transition-colors">
              {job.script_title || job.title_idea || 'Untitled Job'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#475569]">{timeAgo(job.created_at)}</span>
              {job.primary_genre && (
                <>
                  <span className="text-[#1e1e2e]">·</span>
                  <span className="text-xs text-[#6366f1] font-medium">{job.primary_genre}</span>
                </>
              )}
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Pipeline stepper */}
        <PipelineStepper status={job.status} />

        {/* Footer */}
        {job.youtube_url && (
          <div className="mt-4 pt-3 border-t border-[#1e1e2e] flex items-center gap-2">
            <span className="text-[10px] text-[#22d3a0] font-semibold">▶ LIVE ON YOUTUBE</span>
            <span className="text-[10px] text-[#475569] truncate">{job.youtube_url}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
