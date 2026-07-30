import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { enforceRateLimit } from '@/server/security/rateLimit';
import { RateLimitError } from '@/server/http/errors';

describe('enforceRateLimit', () => {
  beforeEach(() => {
    // The bucket map is module-level; tests use unique keys to stay isolated.
  });

  afterEach(() => {
    // No teardown needed because each test uses its own key.
  });

  it('allows the first call under the limit', () => {
    expect(() =>
      enforceRateLimit(`key-${Date.now()}-1`, { limit: 3, windowMs: 60_000 }),
    ).not.toThrow();
  });

  it('throws RateLimitError after exceeding the limit', () => {
    const key = `key-${Date.now()}-2`;
    const config = { limit: 2, windowMs: 60_000 };

    expect(() => enforceRateLimit(key, config)).not.toThrow();
    expect(() => enforceRateLimit(key, config)).not.toThrow();
    expect(() => enforceRateLimit(key, config)).toThrow(RateLimitError);
  });

  it('uses the default limit of 5 when no config is supplied', () => {
    const key = `key-${Date.now()}-3`;

    for (let i = 0; i < 5; i += 1) {
      expect(() => enforceRateLimit(key)).not.toThrow();
    }
    expect(() => enforceRateLimit(key)).toThrow(RateLimitError);
  });

  it('isolates limits across distinct keys', () => {
    const keyA = `key-${Date.now()}-A`;
    const keyB = `key-${Date.now()}-B`;
    const config = { limit: 1, windowMs: 60_000 };

    expect(() => enforceRateLimit(keyA, config)).not.toThrow();
    expect(() => enforceRateLimit(keyB, config)).not.toThrow();
    expect(() => enforceRateLimit(keyA, config)).toThrow(RateLimitError);
  });
});
