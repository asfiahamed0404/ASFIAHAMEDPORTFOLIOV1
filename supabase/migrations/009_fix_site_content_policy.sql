-- Fix site_content policy: ensure drop before create
DROP POLICY IF EXISTS "auth_update_site_content" ON site_content;

CREATE POLICY "auth_update_site_content" ON site_content
FOR UPDATE TO authenticated
USING (true);
