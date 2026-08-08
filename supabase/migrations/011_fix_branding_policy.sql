-- Fix branding bucket policies: drop any existing ones and recreate
DROP POLICY IF EXISTS "authenticated_insert_branding" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_branding" ON storage.objects;

CREATE POLICY "authenticated_insert_branding"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'branding');

CREATE POLICY "authenticated_update_branding"
ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'branding')
WITH CHECK (bucket_id = 'branding');
