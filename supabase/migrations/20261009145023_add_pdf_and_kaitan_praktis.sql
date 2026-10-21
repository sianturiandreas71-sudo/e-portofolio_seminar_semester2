/*
# Add PDF and focus fields to reflections, create kaitan_praktis table

1. Modified Tables
- `reflections` — Add columns for PDF-based reflections:
  - pdf_url (text) — URL to the PDF reflection file
  - focus (text) — Tujuan atau fokus pembelajaran secara ringkas
2. New Tables
- `kaitan_praktis` — Single-row table for the Kaitan Praktis page content.
  - main_concepts (text) — "Konsep Utama yang Saya Pelajari"
  - future_changes (text) — "Perubahan yang Ingin Saya Lakukan di Masa Depan"
3. Security
- Enable RLS on `kaitan_praktis`.
- SELECT open to anon + authenticated (public).
- INSERT/UPDATE/DELETE restricted to authenticated (admin only).
4. Notes
- Existing reflection columns (what_i_learned, learning_experience, reflection, practical_connection, future_changes) remain but are no longer used in the new structure.
- No data is lost; columns are only added.
*/

ALTER TABLE reflections
  ADD COLUMN IF NOT EXISTS pdf_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS focus text DEFAULT '';

CREATE TABLE IF NOT EXISTS kaitan_praktis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  main_concepts text DEFAULT '',
  future_changes text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE kaitan_praktis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_kaitan_praktis" ON kaitan_praktis;
CREATE POLICY "public_read_kaitan_praktis"
ON kaitan_praktis FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_kaitan_praktis" ON kaitan_praktis;
CREATE POLICY "auth_insert_kaitan_praktis"
ON kaitan_praktis FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_kaitan_praktis" ON kaitan_praktis;
CREATE POLICY "auth_update_kaitan_praktis"
ON kaitan_praktis FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_kaitan_praktis" ON kaitan_praktis;
CREATE POLICY "auth_delete_kaitan_praktis"
ON kaitan_praktis FOR DELETE
TO authenticated USING (true);
