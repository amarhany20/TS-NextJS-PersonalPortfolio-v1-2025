import { afterEach, describe, expect, it } from 'vitest';

import { validateEnv } from '@/server/server-validators/env';

const env = process.env as Record<string, string | undefined>;
const ORIGINAL_ENV = { ...env };

function restoreEnv() {
  for (const key of Object.keys(env)) {
    if (!Object.prototype.hasOwnProperty.call(ORIGINAL_ENV, key)) {
      delete env[key];
    }
  }
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    env[key] = value;
  }
}

afterEach(() => {
  restoreEnv();
});

describe('env validator', () => {
  it('accepts a fully populated development env', () => {
    env.NODE_ENV = 'development';
    env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    env.AUTH_SECRET = 'a'.repeat(32);
    env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';

    const result = validateEnv();

    expect(result.NODE_ENV).toBe('development');
    expect(result.DATABASE_URL).toBe('postgresql://user:pass@host:5432/db');
    expect(result.AUTH_SECRET).toBe('a'.repeat(32));
    expect(result.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000');
  });

  it('throws when DATABASE_URL is missing', () => {
    delete env.DATABASE_URL;
    env.AUTH_SECRET = 'a'.repeat(32);

    expect(() => validateEnv()).toThrow('Environment validation failed');
  });

  it('throws when AUTH_SECRET is missing', () => {
    env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    delete env.AUTH_SECRET;

    expect(() => validateEnv()).toThrow('Environment validation failed');
  });

  it('rejects a non-https NEXT_PUBLIC_SITE_URL in production', () => {
    env.NODE_ENV = 'production';
    env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    env.AUTH_SECRET = 'a'.repeat(32);
    env.NEXT_PUBLIC_SITE_URL = 'http://example.com';

    expect(() => validateEnv()).toThrow('Environment validation failed');
  });

  it('requires NEXT_PUBLIC_SITE_URL in production', () => {
    env.NODE_ENV = 'production';
    env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    env.AUTH_SECRET = 'a'.repeat(32);
    delete env.NEXT_PUBLIC_SITE_URL;

    expect(() => validateEnv()).toThrow('Environment validation failed');
  });

  it('coerces AUTH_SALT_ROUNDS to a number', () => {
    env.NODE_ENV = 'development';
    env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    env.AUTH_SECRET = 'a'.repeat(32);
    env.AUTH_SALT_ROUNDS = '8';

    const result = validateEnv();

    expect(result.AUTH_SALT_ROUNDS).toBe(8);
  });

  it('falls back to http://localhost:3000 when NEXT_PUBLIC_SITE_URL is unset in development', () => {
    delete env.NEXT_PUBLIC_SITE_URL;
    env.NODE_ENV = 'development';
    env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    env.AUTH_SECRET = 'a'.repeat(32);

    const result = validateEnv();

    expect(result.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000');
  });
});
