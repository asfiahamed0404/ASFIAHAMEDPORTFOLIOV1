-- Migration: Insert admin profile (replace placeholder ID with your Supabase Auth user UUID)
-- This ensures the admin role exists for RLS checks.
INSERT INTO profiles (id, email, role)
VALUES ('REPLACE_WITH_AUTH_USER_UUID', 'admin@example.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
