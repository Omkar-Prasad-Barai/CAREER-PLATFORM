/**
 * Resolves a backend file path (e.g. "uploads/avatars/xxx.png") into a full
 * HTTP URL that the browser can fetch.
 *
 * - Cloudinary / external URLs (starting with http) are returned as-is.
 * - Local relative paths are prefixed with the backend base URL.
 * - Backslash-corrupted paths (Windows) are cleaned up just in case.
 *
 * @param filePath  The raw path stored in MongoDB (could be relative or absolute URL)
 * @returns         A fully-qualified URL string, or null if no path given.
 */
export function resolveFileUrl(filePath: string | undefined | null): string | null {
  if (!filePath) return null;

  // Already a full URL (Cloudinary, S3, etc.)
  if (filePath.startsWith('http')) return filePath;

  // Normalize any residual Windows backslashes
  const cleaned = filePath.replace(/\\/g, '/');

  // Strip leading slash to avoid double-slash in the final URL
  const normalized = cleaned.startsWith('/') ? cleaned.slice(1) : cleaned;

  const backendBase = (import.meta.env.VITE_API_BASE_URL as string)
    || (import.meta.env.VITE_API_URL as string)?.replace('/api', '')
    || 'http://localhost:5000';

  return `${backendBase}/${normalized}`;
}
