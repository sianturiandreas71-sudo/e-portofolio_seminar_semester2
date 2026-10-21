/*
# Add 4C summary and artifact analysis fields to reflections table

1. Modified Tables
- `reflections` — adds 7 new text columns for the new detail view:
  - `summary_connection` (text) — "Connection" section of the 4C summary
  - `summary_challenge` (text) — "Challenge" section of the 4C summary
  - `summary_concept` (text) — "Concept" section of the 4C summary
  - `summary_change` (text) — "Change" section of the 4C summary
  - `artifact_analysis_summary` (text) — Overall artifact analysis summary
  - `artifact_analysis_reason` (text) — Reason for selecting the artifact
  - `artifact_analysis_meaning` (text) — Meaning derived from the artifact

2. Security
- No changes to RLS — existing policies on `reflections` already cover all columns.

3. Notes
- All new columns are nullable text with empty-string defaults, so existing rows are unaffected.
- The new columns store per-reflection content for the new 3-tab detail view (PDF reader, 4C summary, artifact analysis).
*/

ALTER TABLE reflections
  ADD COLUMN IF NOT EXISTS summary_connection text DEFAULT '',
  ADD COLUMN IF NOT EXISTS summary_challenge text DEFAULT '',
  ADD COLUMN IF NOT EXISTS summary_concept text DEFAULT '',
  ADD COLUMN IF NOT EXISTS summary_change text DEFAULT '',
  ADD COLUMN IF NOT EXISTS artifact_analysis_summary text DEFAULT '',
  ADD COLUMN IF NOT EXISTS artifact_analysis_reason text DEFAULT '',
  ADD COLUMN IF NOT EXISTS artifact_analysis_meaning text DEFAULT '';
