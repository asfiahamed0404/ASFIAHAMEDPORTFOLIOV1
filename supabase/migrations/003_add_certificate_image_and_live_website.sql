-- Add image_url to certificates
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add live_website to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_website TEXT;

-- Create storage bucket for certificate images if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('certificate-images', 'certificate-images', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']::text[])
ON CONFLICT (id) DO NOTHING;
