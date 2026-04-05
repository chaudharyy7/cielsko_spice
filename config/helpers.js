/**
 * Converts various Google Drive sharing URLs to direct viewable image URLs.
 * Supports:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://docs.google.com/uc?id=FILE_ID
 * Returns original URL unchanged if it's not a Google Drive link.
 */
const convertGoogleDriveUrl = (url) => {
  if (!url || typeof url !== 'string') return url;

  // Already a direct uc link
  if (url.includes('drive.google.com/uc')) return url;

  // Match file/d/ID pattern
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  }

  // Match open?id= pattern
  const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  }

  return url;
};

module.exports = { convertGoogleDriveUrl };
