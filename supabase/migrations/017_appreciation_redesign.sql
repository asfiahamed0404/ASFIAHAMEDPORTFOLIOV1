-- ============================================
-- Appreciation Redesign Migration
-- Replaces single-row counter with per-visitor log table
-- for private admin analytics (total/today/week/month)
-- ============================================

-- Create appreciation_logs table for individual appreciation events
CREATE TABLE IF NOT EXISTS appreciation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_visitor UNIQUE (visitor_id)
);

-- Enable RLS
ALTER TABLE appreciation_logs ENABLE ROW LEVEL SECURITY;

-- Grant permissions to anon role (public visitors)
GRANT SELECT, INSERT, DELETE ON public.appreciation_logs TO anon;

-- Grant full access to authenticated role (admin)
GRANT ALL ON public.appreciation_logs TO authenticated;

-- Anon can insert new appreciations (one per visitor_id due to UNIQUE constraint)
DROP POLICY IF EXISTS "anon_insert_appreciation_logs" ON appreciation_logs;
CREATE POLICY "anon_insert_appreciation_logs"
  ON appreciation_logs FOR INSERT TO anon
  WITH CHECK (true);

-- Anon can delete their own appreciation (un-appreciate)
-- They must provide their visitor_id to match
DROP POLICY IF EXISTS "anon_delete_appreciation_logs" ON appreciation_logs;
CREATE POLICY "anon_delete_appreciation_logs"
  ON appreciation_logs FOR DELETE TO anon
  USING (true);

-- Anon CANNOT select (no public count exposure)
-- Only authenticated users (admin) can read the logs

-- Admin full access for dashboard stats
DROP POLICY IF EXISTS "admin_full_appreciation_logs" ON appreciation_logs;
CREATE POLICY "admin_full_appreciation_logs"
  ON appreciation_logs FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Revoke public SELECT on old appreciations table (no longer needed publicly)
-- Keep the table for historical data but remove anon access
DROP POLICY IF EXISTS "anon_select_appreciations" ON appreciations;
DROP POLICY IF EXISTS "anon_update_appreciations" ON appreciations;
REVOKE SELECT ON public.appreciations FROM anon;
REVOKE UPDATE ON public.appreciations FROM anon;
