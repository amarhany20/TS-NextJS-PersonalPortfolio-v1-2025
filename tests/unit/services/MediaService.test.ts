import { createHash } from 'node:crypto';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockDriver = {
  saveFile: vi.fn(),
  deleteFile: vi.fn(),
};

const MAX_BYTES = 10 * 1024 * 1024;

vi.mock('@/server/repositories/MediaRepository', () => ({
  MediaRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/server/serializers/media', () => ({
  serializeMedia: vi.fn((record: any) => ({
    ...record,
    serialized: true,
  })),
}));

vi.mock('@/server/services/media/storage', () => ({
  getMediaStorageDriver: () => mockDriver,
}));

import { BadRequestError, NotFoundError } from '@/server/http/errors';
import { MediaRepository } from '@/server/repositories/MediaRepository';
import { serializeMedia } from '@/server/serializers/media';
import { MediaService } from '@/server/services/MediaService';

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

describe('MediaService', () => {
  it('returns serialized media records', async () => {
    vi.mocked(MediaRepository.findAll).mockResolvedValue([
      { id: 'media-1' } as any,
      { id: 'media-2' } as any,
    ]);
    vi.mocked(serializeMedia).mockImplementation((record: any) => ({
      ...record,
      serialized: true,
    }));

    const result = await MediaService.getMediaLibrary();

    expect(result).toEqual([
      { id: 'media-1', serialized: true },
      { id: 'media-2', serialized: true },
    ]);
  });

  it('uploads media and persists metadata', async () => {
    const payload = 'pixel-data';
    const file = buildFile(payload, 'hero banner.PNG', 'image/png');
    const expectedChecksum = createHash('sha256').update(Buffer.from(payload)).digest('hex');
    const record = { id: 'media-1', checksum: expectedChecksum } as any;

    vi.mocked(MediaRepository.create).mockResolvedValue(record);

    const result = await MediaService.uploadMedia({ file, createdById: 'user-1' });

    expect(mockDriver.saveFile).toHaveBeenCalledWith(
      expect.objectContaining({ mimeType: 'image/png' }),
    );
    expect(MediaRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        originalName: 'hero banner.PNG',
        mimeType: 'image/png',
        checksum: expectedChecksum,
        createdById: 'user-1',
        size: file.size,
      }),
    );
    expect(result).toEqual({ id: 'media-1', checksum: expectedChecksum, serialized: true });
  });

  it('rejects files larger than 10 MB', async () => {
    const file = new File([new Uint8Array(MAX_BYTES + 1)], 'huge.png', { type: 'image/png' });

    await expect(MediaService.uploadMedia({ file })).rejects.toBeInstanceOf(BadRequestError);
  });

  it('rejects unsupported mime types', async () => {
    const file = buildFile('data', 'document.exe', 'application/octet-stream');

    await expect(MediaService.uploadMedia({ file })).rejects.toBeInstanceOf(BadRequestError);
  });

  it('deletes media assets and underlying files', async () => {
    vi.mocked(MediaRepository.findById).mockResolvedValue({
      id: 'media-1',
      path: 'uploads/2025/12/photo.png',
    } as any);
    vi.mocked(MediaRepository.delete).mockResolvedValue(true);

    await MediaService.deleteMedia('media-1');

    expect(MediaRepository.delete).toHaveBeenCalledWith('media-1');
    expect(mockDriver.deleteFile).toHaveBeenCalledWith('uploads/2025/12/photo.png');
  });

  it('throws when deleting missing assets', async () => {
    vi.mocked(MediaRepository.findById).mockResolvedValue(null);

    await expect(MediaService.deleteMedia('missing')).rejects.toBeInstanceOf(NotFoundError);
  });
});
