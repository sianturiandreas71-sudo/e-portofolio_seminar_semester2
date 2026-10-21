/*
# Add video_url column to artifacts table

## Purpose
Supports YouTube video links for artifacts. Instead of uploading video files,
the admin pastes a YouTube URL which is then embedded in the public artifact detail page.

## Changes
- Adds `video_url` (text, nullable, default '') to the `artifacts` table.
- No security changes needed — existing RLS policies already cover all columns on the table.

## Notes
- The column is nullable with a default of empty string, so existing rows are unaffected.
- The frontend will extract the YouTube video ID and render an embed iframe.
*/

ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS video_url text NOT NULL DEFAULT '';
