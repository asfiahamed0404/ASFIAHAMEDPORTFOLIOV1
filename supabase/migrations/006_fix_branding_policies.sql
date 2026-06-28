-- 006_fix_branding_policies.sql
-- --------------------------------------------------------------------
-- Remove any previous, possibly incorrect policies for the branding bucket
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "authenticated_insert_branding"   ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_branding" ON storage.objects;

-- --------------------------------------------------------------------
-- INSERT policy – required for file uploads
-- Allows any authenticated user to INSERT rows whose bucket_id is 'branding'
-- --------------------------------------------------------------------
CREATE POLICY "authenticated_insert_branding"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'branding');

-- --------------------------------------------------------------------
-- UPDATE policy – required when we use upsert/replace on an existing object
-- Allows any authenticated user to UPDATE rows whose bucket_id is 'branding'
-- --------------------------------------------------------------------
CREATE POLICY "authenticated_update_branding"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'branding')
  WITH CHECK (bucket_id = 'branding');