/**
 * Generates a unique-enough client-side id (for React keys / list item ids).
 * crypto.randomUUID() only exists in "secure contexts" — HTTPS, or exactly
 * "localhost". Opening the dev server via a LAN IP (http://192.168.x.x:3000)
 * or using an older browser leaves it undefined, which throws instead of
 * returning undefined — so we feature-detect and fall back instead of
 * calling it directly.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
