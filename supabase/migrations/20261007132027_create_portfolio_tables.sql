/*
# Create E-Portofolio PPG Prajabatan Semester 2 tables

1. New Tables
- `reflections` — Stores reflections for each of the 5 courses in Semester 2.
  - course (text, not null) — course name
  - description (text) — short description shown on list page
  - what_i_learned (text) — "Hal yang Saya Pelajari"
  - learning_experience (text) — "Pengalaman Belajar"
  - reflection (text) — main reflection text
  - practical_connection (text) — "Kaitan Praktis: Konsep Utama"
  - future_changes (text) — "Perubahan yang Ingin Saya Lakukan"
  - image_url (text) — main image URL
  - sort_order (int) — ordering on list page
- `artifacts` — Stores all learning artifacts for Semester 2.
  - title (text, not null)
  - course (text) — related course
  - type (text) — artifact type (Modul Ajar, LKPD, PPT, etc.)
  - description (text)
  - file_url (text) — PDF or file URL
  - file_type (text) — 'pdf', 'image', 'link'
  - preview_url (text) — preview image URL
  - artifact_reason (text) — "Alasan Pemilihan"
  - evidence_shown (text) — "Bukti yang Ditunjukkan"
  - artifact_meaning (text) — "Makna Artefak"
  - learning_from_artifact (text) — "Pembelajaran yang Saya Dapatkan"
  - practical_connection (text) — "Kaitan dengan Praktik"
  - sort_order (int)
- `documentation` — Stores documentation photos.
  - image_url (text, not null)
  - caption (text) — defaults to "Dokumentasi Semester 2"
  - sort_order (int)
- `profile` — Single-row table for the owner's profile info.
  - name (text)
  - program (text)
  - field (text)
  - semester (text)
  - year (text)
  - photo_url (text)
  - bio (text)
2. Security
- Enable RLS on all tables.
- SELECT open to anon + authenticated (public portfolio).
- INSERT/UPDATE/DELETE restricted to authenticated (admin only).
3. Notes
- This is a single-tenant portfolio with admin auth.
- Visitors can read everything; only logged-in admin can edit.
*/

CREATE TABLE IF NOT EXISTS reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course text NOT NULL,
  description text DEFAULT '',
  what_i_learned text DEFAULT '',
  learning_experience text DEFAULT '',
  reflection text DEFAULT '',
  practical_connection text DEFAULT '',
  future_changes text DEFAULT '',
  image_url text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_reflections" ON reflections;
CREATE POLICY "public_read_reflections"
ON reflections FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_reflections" ON reflections;
CREATE POLICY "auth_insert_reflections"
ON reflections FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_reflections" ON reflections;
CREATE POLICY "auth_update_reflections"
ON reflections FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_reflections" ON reflections;
CREATE POLICY "auth_delete_reflections"
ON reflections FOR DELETE
TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  course text DEFAULT '',
  type text DEFAULT '',
  description text DEFAULT '',
  file_url text DEFAULT '',
  file_type text DEFAULT 'pdf',
  preview_url text DEFAULT '',
  artifact_reason text DEFAULT '',
  evidence_shown text DEFAULT '',
  artifact_meaning text DEFAULT '',
  learning_from_artifact text DEFAULT '',
  practical_connection text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_artifacts" ON artifacts;
CREATE POLICY "public_read_artifacts"
ON artifacts FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_artifacts" ON artifacts;
CREATE POLICY "auth_insert_artifacts"
ON artifacts FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_artifacts" ON artifacts;
CREATE POLICY "auth_update_artifacts"
ON artifacts FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_artifacts" ON artifacts;
CREATE POLICY "auth_delete_artifacts"
ON artifacts FOR DELETE
TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS documentation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text DEFAULT 'Dokumentasi Semester 2',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documentation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_documentation" ON documentation;
CREATE POLICY "public_read_documentation"
ON documentation FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_documentation" ON documentation;
CREATE POLICY "auth_insert_documentation"
ON documentation FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_documentation" ON documentation;
CREATE POLICY "auth_update_documentation"
ON documentation FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_documentation" ON documentation;
CREATE POLICY "auth_delete_documentation"
ON documentation FOR DELETE
TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text DEFAULT 'Gomos Andreas Sianturi',
  program text DEFAULT 'PPG Prajabatan',
  field text DEFAULT 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
  semester text DEFAULT 'Semester 2',
  year text DEFAULT '2026',
  photo_url text DEFAULT '',
  bio text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_profile" ON profile;
CREATE POLICY "public_read_profile"
ON profile FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_profile" ON profile;
CREATE POLICY "auth_insert_profile"
ON profile FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_profile" ON profile;
CREATE POLICY "auth_update_profile"
ON profile FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_profile" ON profile;
CREATE POLICY "auth_delete_profile"
ON profile FOR DELETE
TO authenticated USING (true);
