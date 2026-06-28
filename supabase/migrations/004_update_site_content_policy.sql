-- Grant UPDATE permission on site_content for authenticated users
CREATE POLICY "auth_update_site_content" ON site_content
FOR UPDATE TO authenticated
USING (true);
