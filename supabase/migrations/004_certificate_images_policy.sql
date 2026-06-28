-- Migration: Add row-level security policy for certificate images bucket
-- Ensure any existing policies are removed before recreating
DROP POLICY IF EXISTS "authenticated_insert_certificate_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete_certificate_images" ON storage.objects;

-- Allow authenticated users to INSERT (upload) objects to the 'certificate-images' bucket
CREATE POLICY "authenticated_insert_certificate_images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'certificate-images');

-- Allow DELETE for cleanup (admin only)
CREATE POLICY "authenticated_delete_certificate_images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'certificate-images');

-- Allow SELECT for reading
CREATE POLICY "authenticated_select_certificate_images" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'certificate-images');

-- Allow UPDATE for upsert (if needed)
CREATE POLICY "authenticated_update_certificate_images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'certificate-images')
WITH CHECK (bucket_id = 'certificate-images');
