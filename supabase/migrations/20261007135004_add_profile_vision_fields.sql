/*
# Add vision and profile text fields to profile table

1. Modified Tables
- `profile` — Add columns for vision statements and additional profile text.
  - vision_education (text) — "Visi Saya dalam Pendidikan"
  - vision_as_teacher (text) — "Visi Saya sebagai Calon Guru"
  - facilitator_paragraph (text) — Paragraph about being a facilitator and technology use in PJOK
  - education_principle (text) — "Prinsip Penggunaan Teknologi" (extended principle text)
  - self_development (text) — "Langkah Pengembangan Diri"
  - personal_reflection (text) — "Refleksi Pribadi sebagai Calon Guru"
  - short_bio (text) — Short bio paragraph for home page
2. Security
- No security changes. Existing RLS policies on `profile` remain unchanged.
3. Notes
- All new columns are nullable with empty string defaults so existing rows are unaffected.
- The admin Kelola page will be updated to edit these new fields.
*/

ALTER TABLE profile
  ADD COLUMN IF NOT EXISTS vision_education text DEFAULT '',
  ADD COLUMN IF NOT EXISTS vision_as_teacher text DEFAULT '',
  ADD COLUMN facilitator_paragraph text DEFAULT '';

ALTER TABLE profile
  ADD COLUMN IF NOT EXISTS education_principle text DEFAULT '',
  ADD COLUMN IF NOT EXISTS self_development text DEFAULT '',
  ADD COLUMN IF NOT EXISTS personal_reflection text DEFAULT '',
  ADD COLUMN IF NOT EXISTS short_bio text DEFAULT '';
