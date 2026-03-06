/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window to limit requests per IP.
 * 
 * Note: This works per-instance. For horizontal scaling,
 * use Redis-based rate limiting instead.
 */

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap) {
        if (now > value.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);

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
    options: RateLimitOptions = {}
): RateLimitResult {
    const { limit = 10, windowSec = 60 } = options;
    const now = Date.now();
    const windowMs = windowSec * 1000;
    const key = ip;

    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
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
