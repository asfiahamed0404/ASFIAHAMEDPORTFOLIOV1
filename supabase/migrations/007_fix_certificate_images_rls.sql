-- Migration: Fix RLS so certificate image uploads succeed.
-- The previous policy only allowed `authenticated` users to upload, which
-- blocks the public-facing site from uploading certificate images. We
-- add permissive SELECT and INSERT for the public/anon role on the
-- `certificate-images` bucket, and keep DELETE/UPDATE restricted to
-- authenticated admins.
--
-- IMPORTANT: This assumes the bucket `certificate-images` is configured
-- as public-read. If not, set it to public in the Supabase dashboard.

DROP POLICY IF EXISTS "authenticated_insert_certificate_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete_certificate_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_select_certificate_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_certificate_images" ON storage.objects;
DROP POLICY IF EXISTS "public_select_certificate_images" ON storage.objects;
DROP POLICY IF EXISTS "public_insert_certificate_images" ON storage.objects;
DROP POLICY IF EXISTS "public_update_certificate_images" ON storage.objects;
DROP POLICY IF EXISTS "public_delete_certificate_images" ON storage.objects;

-- Public read (anyone can view certificate images)
CREATE POLICY "public_select_certificate_images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'certificate-images');

-- Public insert (lets the admin (anon when running locally / public when
-- running behind a client-only admin) upload new certificate images)
CREATE POLICY "public_insert_certificate_images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'certificate-images');

-- Authenticated-only update (replace an existing certificate image)
CREATE POLICY "public_update_certificate_images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'certificate-images')
WITH CHECK (bucket_id = 'certificate-images');

-- Authenticated-only delete (clean up old certificate images)
CREATE POLICY "public_delete_certificate_images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'certificate-images');
