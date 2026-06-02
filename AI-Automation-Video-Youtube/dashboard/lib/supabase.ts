import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — only created when first used, not at module load time.
// This prevents build-time errors when env vars are not yet set.
let _supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  _supabase = createClient(url, key)
  return _supabase
}

// ── Types ─────────────────────────────────────────────────
export type PipelineStatus =
  | 'pending'
  | 'research_complete'
  | 'script_ready'
  | 'created'
  | 'validated'
  | 'needs_revision'
  | 'publishing'
  | 'published'
  | 'failed'

export interface PipelineJob {
  id: string
  job_id: string
  title_idea: string | null
  script_title: string | null
  primary_genre: string | null
  secondary_genre: string | null
  audio_url: string | null
  video_url: string | null
  thumbnail_url: string | null
  youtube_video_id: string | null
  youtube_url: string | null
  validation_scores: Record<string, number> | null
  revision_notes: string | null
  status: PipelineStatus
  created_at: string
  published_at: string | null
}

export interface ResearchResult {
  id: string
  title_idea: string
  hook_angle: string | null
  primary_genre: string
  tags: string[]
  confidence_score: number
  trend_source: string | null
  created_at: string
}

// ── Queries ───────────────────────────────────────────────
export async function getPipelineStats() {
  try {
    const { data, error } = await getSupabase()
      .from('pipeline_jobs')
      .select('status')
    if (error || !data) return { total: 0, published: 0, failed: 0, pending: 0 }
    return {
      total: data.length,
      published: data.filter(d => d.status === 'published').length,
      failed: data.filter(d => d.status === 'failed').length,
      pending: data.filter(d => !['published', 'failed'].includes(d.status)).length,
    }
  } catch {
    return { total: 0, published: 0, failed: 0, pending: 0 }
  }
}

export async function getRecentJobs(limit = 10): Promise<PipelineJob[]> {
  try {
    const { data, error } = await getSupabase()
      .from('pipeline_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) return []
    return data as PipelineJob[]
  } catch {
    return []
  }
}

export async function getJob(jobId: string): Promise<PipelineJob | null> {
  try {
    const { data, error } = await getSupabase()
      .from('pipeline_jobs')
      .select('*')
      .eq('job_id', jobId)
      .single()
    if (error) return null
    return data as PipelineJob
  } catch {
    return null
  }
}
