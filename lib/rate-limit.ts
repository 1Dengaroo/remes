/**
 * In-memory sliding-window rate limiter.
 *
 * Usage (middleware or route handler):
 *   const limiter = rateLimit({ limit: 10, window: 60 });
 *   const result = limiter.check(userId);
 *   if (!result.success) return Response.json(..., { status: 429 });
 *
 * For serverless: works per-instance. For cross-instance enforcement,
 * swap the Map for Upstash Redis (drop-in compatible).
 */

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  window: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface TokenBucket {
  timestamps: number[];
}

const buckets = new Map<string, TokenBucket>();

// Periodic cleanup to prevent memory leaks - runs every 60s
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      // Remove buckets with no activity in the last 5 minutes
      if (bucket.timestamps.length === 0 || bucket.timestamps.at(-1)! < now - 300_000) {
        buckets.delete(key);
      }
    }
  }, 60_000);
  // Allow the process to exit without waiting for this interval
  if (typeof cleanupInterval === 'object' && 'unref' in cleanupInterval) {
    cleanupInterval.unref();
  }
}

export function rateLimit({ limit, window }: RateLimitOptions) {
  ensureCleanup();
  const windowMs = window * 1000;

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const bucket = buckets.get(key) ?? { timestamps: [] };

      // Drop expired timestamps
      bucket.timestamps = bucket.timestamps.filter((t) => t > now - windowMs);
      const remaining = Math.max(0, limit - bucket.timestamps.length);
      const reset = bucket.timestamps.length > 0 ? bucket.timestamps[0] + windowMs : now + windowMs;

      if (bucket.timestamps.length >= limit) {
        buckets.set(key, bucket);
        return { success: false, limit, remaining: 0, reset };
      }

      bucket.timestamps.push(now);
      buckets.set(key, bucket);
      return { success: true, limit, remaining: remaining - 1, reset };
    }
  };
}

/** Pre-configured limiters for different tiers */
export const rateLimiters = {
  /** Expensive AI operations: research, ICP parsing, email generation */
  ai: rateLimit({ limit: 20, window: 60 }),
  /** External API calls: Apollo search/enrich */
  api: rateLimit({ limit: 30, window: 60 }),
  /** Email sending */
  email: rateLimit({ limit: 20, window: 3600 })
};

/** Build a 429 response with standard rate-limit headers */
export function rateLimitResponse(result: RateLimitResult): Response {
  return Response.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
        'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000))
      }
    }
  );
}
