import { describe, expect, it, vi } from 'vitest';
import { BackupService } from '@/server/services/BackupService';

vi.mock('@/server/db/prisma', () => {
  const mockPrisma = {
    settings: { findMany: vi.fn().mockResolvedValue([{ id: 'settings-singleton', siteTitle: 'Test' }]), upsert: vi.fn() },
    user: { findMany: vi.fn().mockResolvedValue([]) },
    portfolio: { findMany: vi.fn().mockResolvedValue([{ id: 'p1', title: 'Test Project' }]), deleteMany: vi.fn(), create: vi.fn() },
    blog: { findMany: vi.fn().mockResolvedValue([]) },
    category: { findMany: vi.fn().mockResolvedValue([]) },
    tag: { findMany: vi.fn().mockResolvedValue([]) },
    experience: { findMany: vi.fn().mockResolvedValue([]) },
    education: { findMany: vi.fn().mockResolvedValue([]) },
    skillGroup: { findMany: vi.fn().mockResolvedValue([]) },
    skill: { findMany: vi.fn().mockResolvedValue([]) },
    service: { findMany: vi.fn().mockResolvedValue([]) },
    certificate: { findMany: vi.fn().mockResolvedValue([]) },
    recommendation: { findMany: vi.fn().mockResolvedValue([]) },
    media: { findMany: vi.fn().mockResolvedValue([]) },
    contactSubmission: { findMany: vi.fn().mockResolvedValue([]) },
    $transaction: vi.fn().mockImplementation(async (cb) => cb(mockPrisma)),
  };

  return { default: mockPrisma, prisma: mockPrisma };
});

describe('BackupService', () => {
  it('exports database backup snapshot envelope correctly', async () => {
    const backup = await BackupService.exportBackup();

    expect(backup.version).toBe('1.0.0');
    expect(backup.summary?.counts?.portfolio).toBe(1);
    expect(backup.summary?.counts?.settings).toBe(1);
    expect(backup.data.portfolio).toHaveLength(1);
    expect(backup.data.portfolio[0].title).toBe('Test Project');
  });

  it('rejects invalid backup import payloads', async () => {
    await expect(BackupService.importBackup({ invalid: true })).rejects.toThrow(
      'Invalid backup file format.',
    );
  });

  it('imports valid backup payloads transactional', async () => {
    const validBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        portfolio: [{ id: 'p1', title: 'Restored Project' }],
        settings: [{ id: 'settings-singleton', siteTitle: 'Restored Title' }],
      },
    };

    const result = await BackupService.importBackup(validBackup);
    expect(result.success).toBe(true);
    expect(result.totalRestored).toBe(2);
  });
});
