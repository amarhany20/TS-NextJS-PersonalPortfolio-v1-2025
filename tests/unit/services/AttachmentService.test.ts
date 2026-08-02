import { createHash } from 'node:crypto';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockDriver = {
  saveFile: vi.fn(),
  deleteFile: vi.fn(),
};

const MAX_BYTES = 10 * 1024 * 1024;

vi.mock('@/server/repositories/AttachmentRepository', () => ({
  AttachmentRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/server/serializers/attachment', () => ({
  serializeAttachment: vi.fn((record: any) => ({
    ...record,
    serialized: true,
  })),
}));

vi.mock('@/server/services/attachments/storage', () => ({
  getAttachmentStorageDriver: () => mockDriver,
}));

import { BadRequestError, NotFoundError } from '@/server/http/errors';
import { AttachmentRepository } from '@/server/repositories/AttachmentRepository';
import { serializeAttachment } from '@/server/serializers/attachment';
import { AttachmentService } from '@/server/services/AttachmentService';

const buildFile = (contents: string, name = 'photo.png', type = 'image/png') => {
  return new File([contents], name, { type });
};

beforeEach(() => {
  vi.clearAllMocks();
  mockDriver.saveFile.mockResolvedValue({
    path: 'uploads/2025/12/photo.png',
    url: '/uploads/2025/12/photo.png',
    width: 120,
    height: 80,
  });
});

describe('AttachmentService', () => {
  it('returns serialized attachment records', async () => {
    vi.mocked(AttachmentRepository.findAll).mockResolvedValue([
      { id: 'attachment-1' } as any,
      { id: 'attachment-2' } as any,
    ]);
    vi.mocked(serializeAttachment).mockImplementation((record: any) => ({
      ...record,
      serialized: true,
    }));

    const result = await AttachmentService.getAttachmentLibrary();

    expect(result).toEqual([
      { id: 'attachment-1', serialized: true },
      { id: 'attachment-2', serialized: true },
    ]);
  });

  it('uploads an attachment and persists metadata', async () => {
    const payload = 'pixel-data';
    const file = buildFile(payload, 'hero banner.PNG', 'image/png');
    const expectedChecksum = createHash('sha256').update(Buffer.from(payload)).digest('hex');
    const record = { id: 'attachment-1', checksum: expectedChecksum } as any;

    vi.mocked(AttachmentRepository.create).mockResolvedValue(record);

    const result = await AttachmentService.uploadAttachment({ file, createdById: 'user-1' });

    expect(mockDriver.saveFile).toHaveBeenCalledWith(
      expect.objectContaining({ mimeType: 'image/png' }),
    );
    expect(AttachmentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        originalName: 'hero banner.PNG',
        mimeType: 'image/png',
        checksum: expectedChecksum,
        createdById: 'user-1',
        size: file.size,
      }),
    );
    expect(result).toEqual({ id: 'attachment-1', checksum: expectedChecksum, serialized: true });
  });

  it('rejects files larger than 10 MB', async () => {
    const file = new File([new Uint8Array(MAX_BYTES + 1)], 'huge.png', { type: 'image/png' });

    await expect(AttachmentService.uploadAttachment({ file })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('rejects unsupported mime types', async () => {
    const file = buildFile('data', 'document.exe', 'application/octet-stream');

    await expect(AttachmentService.uploadAttachment({ file })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('deletes attachments and underlying files', async () => {
    vi.mocked(AttachmentRepository.findById).mockResolvedValue({
      id: 'attachment-1',
      path: 'uploads/2025/12/photo.png',
    } as any);
    vi.mocked(AttachmentRepository.delete).mockResolvedValue(true);

    await AttachmentService.deleteAttachment('attachment-1');

    expect(AttachmentRepository.delete).toHaveBeenCalledWith('attachment-1');
    expect(mockDriver.deleteFile).toHaveBeenCalledWith('uploads/2025/12/photo.png');
  });

  it('throws when deleting missing attachments', async () => {
    vi.mocked(AttachmentRepository.findById).mockResolvedValue(null);

    await expect(AttachmentService.deleteAttachment('missing')).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
