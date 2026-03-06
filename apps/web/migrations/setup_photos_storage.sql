-- Setup Supabase Storage for photo uploads
-- Run this in Supabase SQL Editor

-- 1. Create the 'photos' storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'photos',
    'photos',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow authenticated users to upload (via service_role, so no RLS needed)
-- The API route uses service_role key, so uploads bypass RLS.

-- 3. Allow public read access for all photos
CREATE POLICY "Public read photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'photos');

-- 4. Add photos column if not exists
ALTER TABLE projects ADD COLUMN IF NOT EXISTS photos TEXT DEFAULT '[]';
