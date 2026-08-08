-- ============================================
-- Migration 016: Fix profiles RLS and admin policy recursion
-- ------------------------------------------------------------
-- ROOT CAUSE (do NOT delete this header on future re-runs):
--   Migrations 001 + 002 enable RLS on `profiles` with only a
--   `profiles_select_own` policy (auth.uid() = id).
--   Migration 015 added GRANT SELECT on profiles TO authenticated,
--   but no matching SELECT policy exists for authenticated users
--   other than the row owner.
--   All admin policies on projects/skills/education/experience/
--   certificates/site_content/socials/appreciations contain
--       USING (EXISTS (SELECT 1 FROM profiles
--                      WHERE id = auth.uid() AND role = 'admin'))
--   which forces the planner to evaluate the profiles RLS check
--   as part of every admin-side REST query. With no permissive
--   authenticated policy on profiles, this evaluation either
--   silently zeros out rows (causing PGRST116 on the admin
--   dashboard) or surfaces as 42501 / 500 on cached PostgREST
--   responses, which the React auth-state listener interprets
--   as a session failure, triggering the login redirect loop
--   AND every subsequent public-table fetch to 500.
--
-- FIX (idempotent, non-destructive):
--   1. Add a permissive `authenticated_select_own_or_admin` policy
--      on profiles so admin policies' EXISTS subquery can resolve
--      when the calling user IS the admin.
--   2. Provide a SECURITY DEFINER helper `public.is_admin()` so
--      admin policies can resolve role without recursing into
--      profiles RLS at all (future-proof + faster).
--   3. Recreate the eight admin policies to call `is_admin()`
--      instead of the profiles EXISTS subquery.
--   4. Keep all anon SELECT policies and grants untouched.
-- ============================================

-- ------------------------------------------------------------
-- 1. Helper: is_admin() — SECURITY DEFINER, no profiles RLS hop
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ------------------------------------------------------------
-- 2. Profiles: add a permissive SELECT for authenticated users
--    so the auth listener can read the role of the row owner
--    without hitting a 42501. (The existing `profiles_select_own`
--    policy already permits this for the owner; we add an
--    admin-can-read-others policy so future admin UIs can list
--    users, but anon access is still blocked by RLS.)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_select_own"  ON profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin"
  ON profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Make sure the authenticated role has at least SELECT.
-- (002 already granted ALL, but 015 only re-granted SELECT —
--  so we re-assert SELECT to be safe across re-runs.)
GRANT SELECT ON profiles TO authenticated;

-- ------------------------------------------------------------
-- 3. Rewrite admin policies on the eight content tables to
--    call is_admin() instead of the profiles EXISTS subquery.
--    This breaks the profiles-RLS recursion that produced the
--    500s and the PGRST116 failures.
-- ------------------------------------------------------------
-- projects
DROP POLICY IF EXISTS "admin_full_projects" ON projects;
CREATE POLICY "admin_full_projects" ON projects
  FOR ALL TO authenticated
  USING      (public.is_admin())
  WITH CHECK (public.is_admin());

-- skills
DROP POLICY IF EXISTS "admin_full_skills" ON skills;
CREATE POLICY "admin_full_skills" ON skills
  FOR ALL TO authenticated
  USING      (public.is_admin())
  WITH CHECK (public.is_admin());

-- education
DROP POLICY IF EXISTS "admin_full_education" ON education;
CREATE POLICY "admin_full_education" ON education
  FOR ALL TO authenticated
  USING      (public.is_admin())
  WITH CHECK (public.is_admin());

-- experience
DROP POLICY IF EXISTS "admin_full_experience" ON experience;
CREATE POLICY "admin_full_experience" ON experience
  FOR ALL TO authenticated
  USING      (public.is_admin())
  WITH CHECK (public.is_admin());

-- certificates
DROP POLICY IF EXISTS "admin_full_certificates" ON certificates;
CREATE POLICY "admin_full_certificates" ON certificates
  FOR ALL TO authenticated
  USING      (public.is_admin())
  WITH CHECK (public.is_admin());

-- site_content
DROP POLICY IF EXISTS "admin_full_site_content" ON site_content;
CREATE POLICY "admin_full_site_content" ON site_content
  FOR ALL TO authenticated
  USING      (public.is_admin())
  WITH CHECK (public.is_admin());

-- socials
DROP POLICY IF EXISTS "admin_full_socials" ON socials;
CREATE POLICY "admin_full_socials" ON socials
  FOR ALL TO authenticated
  USING      (public.is_admin())
  WITH CHECK (public.is_admin());

-- appreciations
DROP POLICY IF EXISTS "admin_full_appreciations" ON appreciations;
CREATE POLICY "admin_full_appreciations" ON appreciations
  FOR ALL TO authenticated
  USING      (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------
-- 4. Defensive: ensure anon can still read every public table.
--    These were created in 001/002/012; re-asserted here so a
--    partial past run can never leave the public site dark.
-- ------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'projects'
      AND policyname = 'anon_select_projects'
  ) THEN
    CREATE POLICY "anon_select_projects"
      ON projects FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'skills'
      AND policyname = 'anon_select_skills'
  ) THEN
    CREATE POLICY "anon_select_skills"
      ON skills FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'education'
      AND policyname = 'anon_select_education'
  ) THEN
    CREATE POLICY "anon_select_education"
      ON education FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'experience'
      AND policyname = 'anon_select_experience'
  ) THEN
    CREATE POLICY "anon_select_experience"
      ON experience FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'certificates'
      AND policyname = 'anon_select_certificates'
  ) THEN
    CREATE POLICY "anon_select_certificates"
      ON certificates FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_content'
      AND policyname = 'anon_select_site_content'
  ) THEN
    CREATE POLICY "anon_select_site_content"
      ON site_content FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'socials'
      AND policyname = 'anon_select_socials'
  ) THEN
    CREATE POLICY "anon_select_socials"
      ON socials FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'appreciations'
      AND policyname = 'anon_select_appreciations'
  ) THEN
    CREATE POLICY "anon_select_appreciations"
      ON appreciations FOR SELECT TO anon USING (true);
  END IF;
END $$;
