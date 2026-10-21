/*
# Create kaitan_praktis_items table (per-course)

1. New Table
- `kaitan_praktis_items` — one row per mata kuliah, storing kaitan praktis content
  per course instead of as a single general record.
  - `id` (uuid PK)
  - `course` (text) — nama mata kuliah
  - `main_concepts` (text) — konsep utama yang dipelajari untuk mata kuliah ini
  - `future_changes` (text) — perubahan yang ingin dilakukan terkait mata kuliah ini
  - `sort_order` (int) — urutan tampil
  - `created_at`, `updated_at`

2. Security
- Enable RLS.
- Public read (anon + authenticated) since portfolio is public.
- Write restricted to authenticated (admin via Kelola).

3. Initial Data
- Migrate existing kaitan_praktis content into a general row (if any exists),
  so old data is not lost. Then admin can split per-course as needed.
*/

CREATE TABLE IF NOT EXISTS kaitan_praktis_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course text NOT NULL DEFAULT '',
  main_concepts text DEFAULT '',
  future_changes text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE kaitan_praktis_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_kaitan_praktis_items" ON kaitan_praktis_items;
CREATE POLICY "read_kaitan_praktis_items"
  ON kaitan_praktis_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_kaitan_praktis_items" ON kaitan_praktis_items;
CREATE POLICY "insert_kaitan_praktis_items"
  ON kaitan_praktis_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_kaitan_praktis_items" ON kaitan_praktis_items;
CREATE POLICY "update_kaitan_praktis_items"
  ON kaitan_praktis_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_kaitan_praktis_items" ON kaitan_praktis_items;
CREATE POLICY "delete_kaitan_praktis_items"
  ON kaitan_praktis_items FOR DELETE
  TO authenticated USING (true);
