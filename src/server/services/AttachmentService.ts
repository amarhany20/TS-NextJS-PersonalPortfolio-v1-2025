import { createHash } from 'node:crypto';
import path from 'node:path';

import { BadRequestError, NotFoundError } from '@/server/http/errors';
import { AttachmentRepository } from '@/server/repositories/AttachmentRepository';
import { serializeAttachment } from '@/server/serializers/attachment';
import { getAttachmentStorageDriver } from '@/server/services/attachments/storage';
import { slugify } from '@/utils/helpers';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = new Set(['application/pdf', 'text/plain']);
const ALLOWED_MIME_PREFIXES = ['image/', 'video/'];

export const AttachmentService = {
  async getAttachmentLibrary() {
    const records = await AttachmentRepository.findAll();
    return records.map(serializeAttachment);
  },

  async uploadAttachment(input: { file: File | null; createdById?: string }) {
    const file = input.file;

    if (!file || typeof file.arrayBuffer !== 'function') {
      throw new BadRequestError('A file upload is required');
    }

    if (file.size === 0) {
      throw new BadRequestError('Uploaded file is empty');
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      throw new BadRequestError('Files must be 10 MB or smaller');
    }

    const mimeType = resolveMimeType(file.type);
    validateMimeType(mimeType);

    const buffer = Buffer.from(await file.arrayBuffer());
    const checksum = createHash('sha256').update(buffer).digest('hex');
    const filename = buildFilename(file.name, mimeType, checksum);

    const storage = getAttachmentStorageDriver();
    const stored = await storage.saveFile({
      buffer,
      filename,
      mimeType,
    });

    const record = await AttachmentRepository.create({
      filename,
      originalName: file.name,
      path: stored.path,
      url: stored.url,
      mimeType,
      size: file.size,
      width: stored.width,
      height: stored.height,
      checksum,
      createdById: input.createdById,
    });

    return serializeAttachment(record);
  },

  async deleteAttachment(id: string) {
    const existing = await AttachmentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Attachment not found');
    }

    const deleted = await AttachmentRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Attachment not found');
    }

    const storage = getAttachmentStorageDriver();
    await storage.deleteFile(existing.path);
  },
};

function resolveMimeType(value?: string): string {
  if (!value) {
    return 'application/octet-stream';
  }

  return value.toLowerCase();
}

function validateMimeType(mimeType: string) {
  const matchesPrefix = ALLOWED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix));

  if (!matchesPrefix && !ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new BadRequestError('Unsupported file type');
  }
}

function buildFilename(originalName: string, mimeType: string, checksum: string) {
  const parsed = path.parse(originalName);
  const extension = (parsed.ext || guessExtension(mimeType)).toLowerCase();
  const safeBase = slugify(parsed.name) || 'asset';
  const stamp = Date.now().toString(36);
  const hashSnippet = checksum.slice(0, 8);

  return `${safeBase}-${stamp}-${hashSnippet}${extension}`;
}

function guessExtension(mimeType: string) {
  if (mimeType === 'image/jpeg') return '.jpg';
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/gif') return '.gif';
  if (mimeType === 'image/webp') return '.webp';
  if (mimeType === 'image/svg+xml') return '.svg';
  if (mimeType === 'video/mp4') return '.mp4';
  if (mimeType === 'application/pdf') return '.pdf';
  return '.bin';
}
