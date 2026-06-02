import { PipelineStatus } from '@/lib/supabase'

// Status config for badges + colors
export const STATUS_CONFIG: Record<PipelineStatus, {
  label: string
  color: string
  bg: string
  dot: string
}> = {
  pending:          { label: 'Pending',          color: '#475569', bg: 'rgba(71,85,105,0.15)',   dot: '#475569' },
  research_complete:{ label: 'Researched',        color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', dot: '#f59e0b' },
  script_ready:     { label: 'Script Ready',      color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', dot: '#38bdf8' },
  created:          { label: 'Video Created',     color: '#818cf8', bg: 'rgba(129,140,248,0.12)',dot: '#818cf8' },
  validated:        { label: 'Validated',         color: '#6366f1', bg: 'rgba(99,102,241,0.15)', dot: '#6366f1' },
  needs_revision:   { label: 'Needs Revision',    color: '#f97316', bg: 'rgba(249,115,22,0.12)', dot: '#f97316' },
  publishing:       { label: 'Publishing...',     color: '#a78bfa', bg: 'rgba(167,139,250,0.12)',dot: '#a78bfa' },
  published:        { label: 'Published',         color: '#22d3a0', bg: 'rgba(34,211,160,0.12)', dot: '#22d3a0' },
  failed:           { label: 'Failed',            color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  dot: '#ef4444' },
}

// Phase progress (0-100) per status
export const STATUS_PROGRESS: Record<PipelineStatus, number> = {
  pending:           5,
  research_complete: 25,
  script_ready:      45,
  created:           60,
  validated:         75,
  needs_revision:    60,
  publishing:        88,
  published:         100,
  failed:            0,
}

// Phase labels for the pipeline stepper
export const PIPELINE_PHASES = [
  { id: 1, name: 'Research', icon: '🔍' },
  { id: 2, name: 'Create',   icon: '🎬' },
  { id: 3, name: 'Validate', icon: '✅' },
  { id: 4, name: 'Publish',  icon: '🚀' },
]

// Map status to active phase
export function getActivePhase(status: PipelineStatus): number {
  if (['pending'].includes(status)) return 0
  if (['research_complete'].includes(status)) return 1
  if (['script_ready', 'created'].includes(status)) return 2
  if (['validated', 'needs_revision'].includes(status)) return 3
  if (['publishing', 'published'].includes(status)) return 4
  return 0
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
