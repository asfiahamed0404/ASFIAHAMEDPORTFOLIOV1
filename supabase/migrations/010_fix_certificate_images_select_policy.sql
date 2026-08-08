-- Fix certificate images SELECT policy to be public (read‑only)
DROP POLICY IF EXISTS "authenticated_select_certificate_images" ON storage.objects;

CREATE POLICY "authenticated_select_certificate_images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'certificate-images');
