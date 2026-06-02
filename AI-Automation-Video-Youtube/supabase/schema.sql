-- ============================================================
-- Supabase Database Schema
-- AI YouTube Automation Pipeline
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Research Results
CREATE TABLE IF NOT EXISTS research_results (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_idea    TEXT NOT NULL,
  hook_angle    TEXT,
  target_emotion TEXT,
  content_outline JSONB,
  primary_genre TEXT DEFAULT 'Comedy',
  secondary_genre TEXT DEFAULT 'Education',
  tags          TEXT[],
  trend_source  TEXT,
  confidence_score INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'research_complete',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Pipeline Jobs (main tracking table)
CREATE TABLE IF NOT EXISTS pipeline_jobs (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id            TEXT UNIQUE NOT NULL,
  title_idea        TEXT,
  script_title      TEXT,
  primary_genre     TEXT,
  secondary_genre   TEXT,
  audio_url         TEXT,
  video_url         TEXT,
  thumbnail_url     TEXT,
  thumbnail_style   TEXT,
  thumbnail_prompt  TEXT,
  youtube_video_id  TEXT,
  youtube_url       TEXT,
  validation_scores JSONB,
  revision_notes    TEXT,
  status            TEXT DEFAULT 'pending'
    CHECK (status IN (
      'pending','research_complete','script_ready',
      'created','validated','needs_revision','publishing','published','failed'
    )),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  published_at      TIMESTAMPTZ
);

-- 3. Publish Logs (audit trail)
CREATE TABLE IF NOT EXISTS publish_logs (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id        TEXT REFERENCES pipeline_jobs(job_id),
  phase         TEXT NOT NULL,
  action        TEXT NOT NULL,
  result        JSONB,
  error         TEXT,
  duration_ms   INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON pipeline_jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON pipeline_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_job_id ON publish_logs(job_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE research_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE publish_logs ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (service role can do everything, anon reads only)
CREATE POLICY "Service role full access - research" ON research_results
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access - jobs" ON pipeline_jobs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access - logs" ON publish_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Anon can read jobs for dashboard
CREATE POLICY "Anon read jobs" ON pipeline_jobs
  FOR SELECT USING (true);
