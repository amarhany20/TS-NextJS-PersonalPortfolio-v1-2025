import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/repositories/UserRepository', () => ({
  UserRepository: {
    findByUsername: vi.fn(),
    recordLogin: vi.fn(),
  },
}));

vi.mock('@/server/security/password', () => ({
  verifyPassword: vi.fn(),
}));

import { UnauthorizedError } from '@/server/http/errors';
import { UserRepository } from '@/server/repositories/UserRepository';
import { verifyPassword } from '@/server/security/password';
import { AuthService } from '../AuthService';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AuthService', () => {
  it('authenticates active users with valid credentials', async () => {
    vi.mocked(UserRepository.findByUsername).mockResolvedValue({
      id: 'user-1',
      username: 'ammar',
      email: 'ammar@example.com',
      displayName: 'Ammar',
      role: 'admin',
      passwordHash: 'hash',
      status: 'active',
    } as any);
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const result = await AuthService.authenticate(' Ammar ', 'secret');

    expect(UserRepository.findByUsername).toHaveBeenCalledWith('ammar');
    expect(UserRepository.recordLogin).toHaveBeenCalledWith('user-1');
    expect(result).toMatchObject({ id: 'user-1', username: 'ammar' });
  });

  it('throws UnauthorizedError when user missing', async () => {
    vi.mocked(UserRepository.findByUsername).mockResolvedValue(null);

    await expect(AuthService.authenticate('ghost', 'secret')).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('throws UnauthorizedError when password mismatch', async () => {
    vi.mocked(UserRepository.findByUsername).mockResolvedValue({
      id: 'user-1',
      username: 'ammar',
      email: 'ammar@example.com',
      displayName: 'Ammar',
      role: 'admin',
      passwordHash: 'hash',
      status: 'active',
    } as any);
    vi.mocked(verifyPassword).mockResolvedValue(false);

    await expect(AuthService.authenticate('ammar', 'bad')).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
