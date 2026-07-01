-- Ensure anonymous SELECT policies and privileges are present for public tables

-- Projects
DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT TO anon USING (true);
GRANT SELECT ON projects TO anon;

-- Skills
DROP POLICY IF EXISTS "anon_select_skills" ON skills;
CREATE POLICY "anon_select_skills" ON skills FOR SELECT TO anon USING (true);
GRANT SELECT ON skills TO anon;

-- Education
DROP POLICY IF EXISTS "anon_select_education" ON education;
CREATE POLICY "anon_select_education" ON education FOR SELECT TO anon USING (true);
GRANT SELECT ON education TO anon;

-- Experience
DROP POLICY IF EXISTS "anon_select_experience" ON experience;
CREATE POLICY "anon_select_experience" ON experience FOR SELECT TO anon USING (true);
GRANT SELECT ON experience TO anon;

-- Certificates
DROP POLICY IF EXISTS "anon_select_certificates" ON certificates;
CREATE POLICY "anon_select_certificates" ON certificates FOR SELECT TO anon USING (true);
GRANT SELECT ON certificates TO anon;

-- Site Content
DROP POLICY IF EXISTS "anon_select_site_content" ON site_content;
CREATE POLICY "anon_select_site_content" ON site_content FOR SELECT TO anon USING (true);
GRANT SELECT ON site_content TO anon;

-- Socials
DROP POLICY IF EXISTS "anon_select_socials" ON socials;
CREATE POLICY "anon_select_socials" ON socials FOR SELECT TO anon USING (true);
GRANT SELECT ON socials TO anon;

-- Appreciations
DROP POLICY IF EXISTS "anon_select_appreciations" ON appreciations;
CREATE POLICY "anon_select_appreciations" ON appreciations FOR SELECT TO anon USING (true);
GRANT SELECT ON appreciations TO anon;
