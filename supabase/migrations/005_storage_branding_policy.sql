-- Drop existing branding policies (idempotent)
DROP POLICY IF EXISTS "authenticated_insert_branding" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_branding" ON storage.objects;

-- Grant INSERT permission on the branding bucket for authenticated users
-- This allows file uploads via supabase.storage.from('branding')
CREATE POLICY "authenticated_insert_branding"
  ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'branding'
  );

-- Allow authenticated users to UPDATE objects only in the branding bucket (required for upsert)
CREATE POLICY "authenticated_update_branding"
  ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'branding'
  );