import { compare, genSalt, hash } from 'bcryptjs';
import { env } from '@/server/server-validators/env';
import { logger } from '@/utils/logger';

const DEFAULT_SALT_ROUNDS = env.AUTH_SALT_ROUNDS;

/**
 * Hashes a plain-text password using the configured salt rounds.
 */
export async function hashPassword(plainText: string): Promise<string> {
  if (!plainText) {
    throw new Error('Password must be provided for hashing.');
  }

  const salt = await genSalt(DEFAULT_SALT_ROUNDS);
  return hash(plainText, salt);
}

export async function verifyPassword(plainText: string, passwordHash: string): Promise<boolean> {
  if (!plainText || !passwordHash) {
    return false;
  }

  try {
    return await compare(plainText, passwordHash);
  } catch (error) {
    if (env.NODE_ENV === 'development') {
      logger.warn('Failed to verify password hash', { error });
    }
    return false;
  }
}
