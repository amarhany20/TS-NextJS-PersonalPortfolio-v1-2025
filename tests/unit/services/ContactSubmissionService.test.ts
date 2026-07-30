import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/repositories/ContactSubmissionRepository', () => ({
  ContactSubmissionRepository: {
    create: vi.fn(),
    findAll: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/server/serializers/contactSubmission', () => ({
  serializeContactSubmission: vi.fn((record: any) => ({ ...record, serialized: true })),
}));

import { BadRequestError, NotFoundError } from '@/server/http/errors';
import { ContactSubmissionRepository } from '@/server/repositories/ContactSubmissionRepository';
import { serializeContactSubmission } from '@/server/serializers/contactSubmission';
import { ContactSubmissionService } from '@/server/services/ContactSubmissionService';

describe('ContactSubmissionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(serializeContactSubmission).mockImplementation((record: any) => ({
      ...record,
      serialized: true,
    }));
  });

  it('creates submissions with trimmed payloads', async () => {
    vi.mocked(ContactSubmissionRepository.create).mockResolvedValue({ id: 'sub-1' } as any);

    const result = await ContactSubmissionService.submitContact({
      name: '  Jane Doe  ',
      email: ' USER@example.com ',
      phone: ' 555-1234 ',
      subject: '  Project ',
      message: '   Hello world!   ',
    });

    expect(ContactSubmissionRepository.create).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'user@example.com',
      phone: '555-1234',
      subject: 'Project',
      message: 'Hello world!',
      status: 'new',
    });
    expect(result).toEqual({ id: 'sub-1', serialized: true });
  });

  it('throws when required fields are missing after trim', async () => {
    await expect(
      ContactSubmissionService.submitContact({
        name: ' ',
        email: 'user@example.com',
        message: '   ',
      } as any),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('lists submissions via serializer', async () => {
    vi.mocked(ContactSubmissionRepository.findAll).mockResolvedValue([
      { id: 'sub-1' } as any,
      { id: 'sub-2' } as any,
    ]);
    vi.mocked(serializeContactSubmission).mockImplementation((record: any) => ({
      ...record,
      ok: true,
    }));

    const result = await ContactSubmissionService.listSubmissions();
    expect(result).toEqual([
      { id: 'sub-1', ok: true },
      { id: 'sub-2', ok: true },
    ]);
  });

  it('updates status and serializes result', async () => {
    vi.mocked(ContactSubmissionRepository.updateStatus).mockResolvedValue({
      id: 'sub-1',
      status: 'resolved',
    } as any);

    const result = await ContactSubmissionService.updateSubmissionStatus('sub-1', 'resolved');

    expect(ContactSubmissionRepository.updateStatus).toHaveBeenCalledWith('sub-1', 'resolved');
    expect(result).toEqual({ id: 'sub-1', status: 'resolved', serialized: true });
  });

  it('throws when updating missing submission', async () => {
    vi.mocked(ContactSubmissionRepository.updateStatus).mockResolvedValue(null);

    await expect(
      ContactSubmissionService.updateSubmissionStatus('missing', 'resolved'),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws when deleting missing submission', async () => {
    vi.mocked(ContactSubmissionRepository.delete).mockResolvedValue(false);

    await expect(ContactSubmissionService.deleteSubmission('missing')).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
