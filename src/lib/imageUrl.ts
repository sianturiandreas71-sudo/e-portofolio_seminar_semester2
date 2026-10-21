/**
 * Converts a Google Drive sharing URL into a directly embeddable image URL.
 * Handles formats like:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 * Returns the original URL unchanged if it's not a Google Drive link.
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return '';

  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }

  return url;
}

/**
 * Converts a Google Drive sharing URL into a format that can be embedded
 * in an iframe for document viewing.
 *
 * Uses Google Docs Viewer (docs.google.com/gview) which is specifically
 * designed for embedding and does not have the same X-Frame-Options
 * restrictions as Drive's /view or /preview endpoints.
 *
 * For non-Google-Drive URLs, returns the original URL unchanged.
 */
export function normalizeEmbedUrl(url: string): string {
  if (!url) return '';

  const fileId = extractDriveFileId(url);
  if (fileId) {
    const directUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
    return `https://docs.google.com/gview?url=${encodeURIComponent(directUrl)}&embedded=true`;
  }

  return url;
}

/**
 * Extracts the file ID from any Google Drive URL format.
 * Returns null if the URL is not a Google Drive link.
 */
function extractDriveFileId(url: string): string | null {
  // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  // https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) return openMatch[1];

  // https://drive.google.com/uc?id=FILE_ID
  const ucMatch = url.match(/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) return ucMatch[1];

  // https://drive.google.com/thumbnail?id=FILE_ID
  const thumbMatch = url.match(/drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/);
  if (thumbMatch) return thumbMatch[1];

  return null;
}

/**
 * Returns a direct link to open the file in a new tab.
 * For Google Drive URLs, this uses the /view path which works in a
 * standalone browser tab.
 */
export function normalizeDirectUrl(url: string): string {
  if (!url) return '';

  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }

  return url;
}
