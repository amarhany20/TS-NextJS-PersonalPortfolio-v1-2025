import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';

import { UnauthorizedError } from '@/server/http/errors';

vi.mock('@/server/services/BackupService', () => ({
  BackupService: {
    exportBackup: vi.fn(),
    importBackup: vi.fn(),
  },
}));

vi.mock('@/server/security/session', () => ({
  requireAuth: vi.fn(),
}));

vi.mock('@/server/security/password', () => ({
  verifyPassword: vi.fn(),
}));

vi.mock('@/server/db/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

const { BackupService } = await import('@/server/services/BackupService');
const { requireAuth } = await import('@/server/security/session');
const { verifyPassword } = await import('@/server/security/password');
const prisma = (await import('@/server/db/prisma')).default as unknown as {
  user: { findUnique: Mock };
};

import { GET, POST } from '@/app/api/v1/admin/backup/route';

afterEach(() => {
  vi.clearAllMocks();
});

describe('backup api routes', () => {
  it('GET requires authentication', async () => {
    (requireAuth as unknown as Mock).mockRejectedValue(
      new UnauthorizedError('Authentication required'),
    );

    const response = await GET();

    expect(response.status).toBe(401);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(BackupService.exportBackup).not.toHaveBeenCalled();
  });

  it('GET exports a JSON backup as an attachment', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});
    (BackupService.exportBackup as unknown as Mock).mockResolvedValue({
      version: 1,
      exportedAt: '2026-08-01',
      data: { portfolio: [] },
    });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('content-disposition')).toContain('attachment');

    const payload = await response.json();
    expect(payload.version).toBe(1);
    expect(payload.data.portfolio).toEqual([]);
  });

  it('POST requires authentication', async () => {
    (requireAuth as unknown as Mock).mockRejectedValue(
      new UnauthorizedError('Authentication required'),
    );

    const response = await POST(
      new Request('http://localhost/api/v1/admin/backup', { method: 'POST' }),
    );

    expect(response.status).toBe(401);
    const payload = await response.json();
    expect(payload.success).toBe(false);
  });

  it('POST restores a backup from a raw JSON body', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({ user: { id: 'u1' } });
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      username: 'admin',
      passwordHash: 'hash',
    });
    (verifyPassword as unknown as Mock).mockResolvedValue(true);
    (BackupService.importBackup as unknown as Mock).mockResolvedValue({
      imported: 15,
      domains: ['portfolio', 'blog'],
    });

    const response = await POST(
      new Request('http://localhost/api/v1/admin/backup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ version: 1, data: {}, password: 'correct-password' }),
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.imported).toBe(15);
    expect(BackupService.importBackup).toHaveBeenCalledTimes(1);
  });

  it('POST restores a backup from a multipart file upload', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({ user: { id: 'u1' } });
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      username: 'admin',
      passwordHash: 'hash',
    });
    (verifyPassword as unknown as Mock).mockResolvedValue(true);
    (BackupService.importBackup as unknown as Mock).mockResolvedValue({ imported: 15 });

    const form = new FormData();
    form.append(
      'file',
      new File([JSON.stringify({ version: 1, data: {} })], 'backup.json', {
        type: 'application/json',
      }),
    );
    form.append('password', 'correct-password');

    const response = await POST(
      new Request('http://localhost/api/v1/admin/backup', { method: 'POST', body: form }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(BackupService.importBackup).toHaveBeenCalledTimes(1);
  });
});
