'use client'

import { PipelineStatus } from '@/lib/supabase'
import { STATUS_CONFIG } from '@/lib/utils'

export function StatusBadge({ status }: { status: PipelineStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="badge"
      style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}22` }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: cfg.dot }}
      />
      {cfg.label}
    </span>
  )
}
