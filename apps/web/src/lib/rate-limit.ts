/**
 * Lightweight rate limiter for serverless (Vercel / edge).
 *
 * Uses in-memory Map — provides per-instance protection only.
 * For true distributed limiting, swap to Upstash Redis.
 *
 * Improvements over previous version:
 * - No setInterval (leaked timer in serverless cold starts)
 * - Inline cleanup with size cap (prevents unbounded growth)
 * - LRU-style eviction when map exceeds MAX_ENTRIES
 */

const MAX_ENTRIES = 5000;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function evictExpired() {
  const now = Date.now();
  if (rateLimitMap.size < MAX_ENTRIES) return;
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
  // If still too large, drop oldest 25%
  if (rateLimitMap.size >= MAX_ENTRIES) {
    const toDelete = Math.floor(rateLimitMap.size * 0.25);
    let deleted = 0;
    for (const key of rateLimitMap.keys()) {
      if (deleted >= toDelete) break;
      rateLimitMap.delete(key);
      deleted++;
    }
  }
}

interface RateLimitOptions {
  /** Max requests per window */
  limit?: number;
  /** Window duration in seconds */
  windowSec?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

export function checkRateLimit(
  ip: string,
  options: RateLimitOptions = {},
): RateLimitResult {
  const { limit = 10, windowSec = 60 } = options;
  const now = Date.now();
  const windowMs = windowSec * 1000;

  evictExpired();

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetIn: windowSec };
  }

  if (entry.count >= limit) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, resetIn };
  }

  entry.count++;
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);
  return { allowed: true, remaining: limit - entry.count, resetIn };
}
