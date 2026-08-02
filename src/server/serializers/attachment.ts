import type { DbAttachment } from '@/server/repositories/AttachmentRepository';
import type { AttachmentAsset } from '@/types/attachment';

export function serializeAttachment(record: DbAttachment): AttachmentAsset {
  const normalizedPath = record.path.replace(/\\/g, '/');
  return {
    id: record.id,
    filename: record.filename,
    originalName: record.originalName ?? undefined,
    path: normalizedPath,
    url: record.url ?? `/${normalizedPath}`,
    mimeType: record.mimeType,
    size: record.size,
    width: record.width ?? undefined,
    height: record.height ?? undefined,
    checksum: record.checksum ?? undefined,
    createdAt: record.createdAt.toISOString(),
    createdById: record.createdById ?? undefined,
    createdByName: record.createdBy?.displayName ?? undefined,
  };
}
