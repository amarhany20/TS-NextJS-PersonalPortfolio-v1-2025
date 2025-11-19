import { RateLimitError } from '@/server/http/errors';

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

interface RateLimitState {
  count: number;
  expiresAt: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  limit: 5,
  windowMs: 60_000,
};

const buckets = new Map<string, RateLimitState>();

export function enforceRateLimit(key: string, config: Partial<RateLimitConfig> = {}): void {
  const { limit, windowMs } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const state = buckets.get(key);

  if (state && state.expiresAt > now) {
    if (state.count >= limit) {
      throw new RateLimitError('Too many requests. Please try again later.');
    }

    state.count += 1;
    buckets.set(key, state);
    return;
  }

  buckets.set(key, {
    count: 1,
    expiresAt: now + windowMs,
  });
}
