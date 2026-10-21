/*
# Create desain_karya table

1. New Tables
- `desain_karya` — stores the "Desain Karya Inovatif" content as a single-row table.
  - `id` (uuid, primary key)
  - `intro` (text) — Introductory paragraph for the page
  - `work_name` (text) — A. Nama karya inovatif
  - `target_audience` (text) — A. Sasaran inovasi (peserta didik, kelas, dll.)
  - `challenge` (text) — B. Tantangan atau permasalahan
  - `solution_idea` (text) — B. Gagasan solusi
  - `research_result` (text) — B. Hasil riset sederhana
  - `prototype_desc` (text) — C. Rancangan/prototipe
  - `how_it_works` (text) — C. Cara kerja atau bentuk karya
  - `implementation_plan` (text) — C. Rencana implementasi di kelas
  - `link_url_1` (text) — C. Tautan pendukung 1 (URL)
  - `link_label_1` (text) — C. Label tautan 1
  - `link_url_2` (text) — C. Tautan pendukung 2 (URL)
  - `link_label_2` (text) — C. Label tautan 2
  - `link_url_3` (text) — C. Tautan pendukung 3 (URL)
  - `link_label_3` (text) — C. Label tautan 3
  - `eval_stages` (text) — D. Tahapan evaluasi
  - `novelty_indicator` (text) — D. Indikator kebaruan
  - `creativity_indicator` (text) — D. Indikator kreativitas
  - `usefulness_indicator` (text) — D. Indikator kebermanfaatan
  - `evidence_method` (text) — D. Cara mengumpulkan bukti/data evaluasi
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `desain_karya`.
- Public read for anon + authenticated (portfolio is public).
- Write restricted to authenticated users (admin via Kelola).

3. Initial Data
- Inserts one default row with the provided intro text and empty content fields.
*/

CREATE TABLE IF NOT EXISTS desain_karya (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intro text DEFAULT '',
  work_name text DEFAULT '',
  target_audience text DEFAULT '',
  challenge text DEFAULT '',
  solution_idea text DEFAULT '',
  research_result text DEFAULT '',
  prototype_desc text DEFAULT '',
  how_it_works text DEFAULT '',
  implementation_plan text DEFAULT '',
  link_url_1 text DEFAULT '',
  link_label_1 text DEFAULT '',
  link_url_2 text DEFAULT '',
  link_label_2 text DEFAULT '',
  link_url_3 text DEFAULT '',
  link_label_3 text DEFAULT '',
  eval_stages text DEFAULT '',
  novelty_indicator text DEFAULT '',
  creativity_indicator text DEFAULT '',
  usefulness_indicator text DEFAULT '',
  evidence_method text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE desain_karya ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_desain_karya" ON desain_karya;
CREATE POLICY "read_desain_karya"
  ON desain_karya FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_desain_karya" ON desain_karya;
CREATE POLICY "insert_desain_karya"
  ON desain_karya FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_desain_karya" ON desain_karya;
CREATE POLICY "update_desain_karya"
  ON desain_karya FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_desain_karya" ON desain_karya;
CREATE POLICY "delete_desain_karya"
  ON desain_karya FOR DELETE
  TO authenticated USING (true);

INSERT INTO desain_karya (intro)
SELECT 'Halaman ini memuat dokumentasi penyusunan desain karya inovatif sebagai bagian dari perjalanan belajar selama mengikuti PPG Prajabatan. Desain karya inovatif disusun dengan memperhatikan kebutuhan, tantangan pembelajaran, gagasan solusi, proses perancangan, implementasi, dan evaluasi kebermanfaatannya.'
WHERE NOT EXISTS (SELECT 1 FROM desain_karya);
