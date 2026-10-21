/*
# Create Supabase Storage Buckets for File Uploads

## Purpose
Replaces URL-based file references with direct file uploads from the admin's device.
Three buckets are created for the three types of files used in the e-portfolio:
artifacts (PDF/DOC/DOCX + images), reflections (PDF only), and documentation (photos).

## New Storage Buckets
1. `artifacts` — stores modul ajar, LKPD, and other supporting documents (PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP). Public read, authenticated write.
2. `reflections` — stores reflection PDF files. Public read, authenticated write.
3. `documentation` — stores documentation photos (JPG, JPEG, PNG, WEBP). Public read, authenticated write.

## Security
- All three buckets are public-read (anyone can view files without signing in).
- Only authenticated users can upload, update, or delete files.
- MIME type and file size validation is enforced client-side in the upload helper.
*/

INSERT INTO storage.buckets (id, name, public) VALUES
  ('artifacts', 'artifacts', true),
  ('reflections', 'reflections', true),
  ('documentation', 'documentation', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for artifacts bucket
DROP POLICY IF EXISTS "public_read_artifacts_storage" ON storage.objects;
CREATE POLICY "public_read_artifacts_storage"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'artifacts');

DROP POLICY IF EXISTS "auth_insert_artifacts_storage" ON storage.objects;
CREATE POLICY "auth_insert_artifacts_storage"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'artifacts');

DROP POLICY IF EXISTS "auth_update_artifacts_storage" ON storage.objects;
CREATE POLICY "auth_update_artifacts_storage"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'artifacts')
WITH CHECK (bucket_id = 'artifacts');

DROP POLICY IF EXISTS "auth_delete_artifacts_storage" ON storage.objects;
CREATE POLICY "auth_delete_artifacts_storage"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'artifacts');

-- Policies for reflections bucket
DROP POLICY IF EXISTS "public_read_reflections_storage" ON storage.objects;
CREATE POLICY "public_read_reflections_storage"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'reflections');

DROP POLICY IF EXISTS "auth_insert_reflections_storage" ON storage.objects;
CREATE POLICY "auth_insert_reflections_storage"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'reflections');

DROP POLICY IF EXISTS "auth_update_reflections_storage" ON storage.objects;
CREATE POLICY "auth_update_reflections_storage"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'reflections')
WITH CHECK (bucket_id = 'reflections');

DROP POLICY IF EXISTS "auth_delete_reflections_storage" ON storage.objects;
CREATE POLICY "auth_delete_reflections_storage"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'reflections');

-- Policies for documentation bucket
DROP POLICY IF EXISTS "public_read_documentation_storage" ON storage.objects;
CREATE POLICY "public_read_documentation_storage"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'documentation');

DROP POLICY IF EXISTS "auth_insert_documentation_storage" ON storage.objects;
CREATE POLICY "auth_insert_documentation_storage"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documentation');

DROP POLICY IF EXISTS "auth_update_documentation_storage" ON storage.objects;
CREATE POLICY "auth_update_documentation_storage"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documentation')
WITH CHECK (bucket_id = 'documentation');

DROP POLICY IF EXISTS "auth_delete_documentation_storage" ON storage.objects;
CREATE POLICY "auth_delete_documentation_storage"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documentation');
