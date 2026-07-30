import { describe, expect, it } from 'vitest';

import { hashPassword, verifyPassword } from '@/server/security/password';

describe('password helpers', () => {
  it('hashes a password into a non-empty bcrypt hash', async () => {
    const hash = await hashPassword('correct-horse-battery-staple');

    expect(hash).toBeTruthy();
    expect(hash).not.toBe('correct-horse-battery-staple');
    expect(hash.startsWith('$2')).toBe(true);
  });

  it('produces different hashes for the same input (salt is random)', async () => {
    const first = await hashPassword('hunter2');
    const second = await hashPassword('hunter2');

    expect(first).not.toBe(second);
  });

  it('verifies the original password against its hash', async () => {
    const hash = await hashPassword('one-two-three');
    expect(await verifyPassword('one-two-three', hash)).toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('one-two-three');
    expect(await verifyPassword('one-two-four', hash)).toBe(false);
  });

  it('returns false when the input is empty', async () => {
    const hash = await hashPassword('one-two-three');
    expect(await verifyPassword('', hash)).toBe(false);
  });

  it('returns false when the stored hash is empty', async () => {
    expect(await verifyPassword('one-two-three', '')).toBe(false);
  });

  it('throws when hashing an empty password', async () => {
    await expect(hashPassword('')).rejects.toThrow('Password must be provided for hashing.');
  });
});
