import { compare, genSalt, hash } from 'bcryptjs';

const DEFAULT_SALT_ROUNDS = Number(process.env.AUTH_SALT_ROUNDS ?? 12);

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
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to verify password hash', error);
    }
    return false;
  }
}
