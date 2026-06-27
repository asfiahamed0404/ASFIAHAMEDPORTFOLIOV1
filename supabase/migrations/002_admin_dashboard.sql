-- ============================================
-- Admin Dashboard Migration (Simplified)
-- Phase 3: Fix RLS to allow authenticated access
-- ============================================

-- ============================================
-- STEP 1: Drop all existing admin policies first
-- ============================================

-- Drop admin policies on projects
DROP POLICY IF EXISTS "admin_all_projects" ON projects;
DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
DROP POLICY IF EXISTS "admin_update_projects" ON projects;
DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
DROP POLICY IF EXISTS "anon_select_projects" ON projects;

-- Drop admin policies on skills
DROP POLICY IF EXISTS "admin_all_skills" ON skills;
DROP POLICY IF EXISTS "admin_insert_skills" ON skills;
DROP POLICY IF EXISTS "admin_update_skills" ON skills;
DROP POLICY IF EXISTS "admin_delete_skills" ON skills;
DROP POLICY IF EXISTS "anon_select_skills" ON skills;

-- Drop admin policies on education
DROP POLICY IF EXISTS "admin_all_education" ON education;
DROP POLICY IF EXISTS "admin_insert_education" ON education;
DROP POLICY IF EXISTS "admin_update_education" ON education;
DROP POLICY IF EXISTS "admin_delete_education" ON education;
DROP POLICY IF EXISTS "anon_select_education" ON education;

-- Drop admin policies on experience
DROP POLICY IF EXISTS "admin_all_experience" ON experience;
DROP POLICY IF EXISTS "admin_insert_experience" ON experience;
DROP POLICY IF EXISTS "admin_update_experience" ON experience;
DROP POLICY IF EXISTS "admin_delete_experience" ON experience;
DROP POLICY IF EXISTS "anon_select_experience" ON experience;

-- Drop admin policies on certificates
DROP POLICY IF EXISTS "admin_all_certificates" ON certificates;
DROP POLICY IF EXISTS "admin_insert_certificates" ON certificates;
DROP POLICY IF EXISTS "admin_update_certificates" ON certificates;
DROP POLICY IF EXISTS "admin_delete_certificates" ON certificates;
DROP POLICY IF EXISTS "anon_select_certificates" ON certificates;

-- Drop admin policies on site_content
DROP POLICY IF EXISTS "admin_all_site_content" ON site_content;
DROP POLICY IF EXISTS "admin_insert_site_content" ON site_content;
DROP POLICY IF EXISTS "admin_update_site_content" ON site_content;
DROP POLICY IF EXISTS "admin_delete_site_content" ON site_content;
DROP POLICY IF EXISTS "anon_select_site_content" ON site_content;

-- Drop admin policies on socials
DROP POLICY IF EXISTS "admin_all_socials" ON socials;
DROP POLICY IF EXISTS "admin_insert_socials" ON socials;
DROP POLICY IF EXISTS "admin_update_socials" ON socials;
DROP POLICY IF EXISTS "admin_delete_socials" ON socials;
DROP POLICY IF EXISTS "anon_select_socials" ON socials;

-- Drop admin policies on appreciations
DROP POLICY IF EXISTS "admin_all_appreciations" ON appreciations;
DROP POLICY IF EXISTS "admin_insert_appreciations" ON appreciations;
DROP POLICY IF EXISTS "admin_update_appreciations" ON appreciations;
DROP POLICY IF EXISTS "admin_delete_appreciations" ON appreciations;
DROP POLICY IF EXISTS "anon_select_appreciations" ON appreciations;
DROP POLICY IF EXISTS "anon_update_appreciations" ON appreciations;

-- ============================================
-- STEP 2: Create simple RLS policies that work
-- ============================================

-- Projects: Allow authenticated users full access
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_full_projects" ON projects FOR ALL TO authenticated USING (true);

-- Skills: Allow authenticated users full access
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_full_skills" ON skills FOR ALL TO authenticated USING (true);

-- Education: Allow authenticated users full access
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_full_education" ON education FOR ALL TO authenticated USING (true);

-- Experience: Allow authenticated users full access
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_full_experience" ON experience FOR ALL TO authenticated USING (true);

-- Certificates: Allow authenticated users full access
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_full_certificates" ON certificates FOR ALL TO authenticated USING (true);

-- Site Content: Allow authenticated users full access
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_full_site_content" ON site_content FOR ALL TO authenticated USING (true);

-- Socials: Allow authenticated users full access
ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_full_socials" ON socials FOR ALL TO authenticated USING (true);

-- Appreciations: Keep existing anon UPDATE, add authenticated UPDATE
ALTER TABLE appreciations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_appreciations" ON appreciations;
DROP POLICY IF EXISTS "anon_update_appreciations" ON appreciations;
CREATE POLICY "authenticated_full_appreciations" ON appreciations FOR ALL TO authenticated USING (true);

-- ============================================
-- STEP 3: Grant permissions
-- ============================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- ============================================
-- STEP 4: Create profiles table for future admin tracking
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

GRANT ALL ON profiles TO authenticated;

-- Insert admin user (get ID from Supabase Auth dashboard)
-- INSERT INTO profiles (id, email, role) 
-- VALUES ('auth-user-uuid-here', 'admin@gmail.com', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';