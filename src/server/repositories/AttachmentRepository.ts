import prisma from '@/server/db/prisma';

export interface DbAttachment {
  id: string;
  filename: string;
  originalName?: string | null;
  path: string;
  url?: string | null;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  checksum?: string | null;
  createdById?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: {
    id: string;
    displayName: string;
    email: string;
  } | null;
}

export interface AttachmentCreateData {
  filename: string;
  originalName?: string | null;
  path: string;
  url?: string | null;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  checksum?: string | null;
  createdById?: string | null;
}

export class AttachmentRepository {
  static async findAll(): Promise<DbAttachment[]> {
    const records = await prisma.attachment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    return records.map(mapAttachment).filter(Boolean) as DbAttachment[];
  }

  static async findById(id: string): Promise<DbAttachment | null> {
    const record = await prisma.attachment.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    return record ? mapAttachment(record) : null;
  }

  static async create(data: AttachmentCreateData): Promise<DbAttachment> {
    const record = await prisma.attachment.create({
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    return mapAttachment(record)!;
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.attachment.delete({ where: { id } });
      return true;
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        return false;
      }

      throw error;
    }
  }
}

type AttachmentRecord =
  | (Awaited<ReturnType<typeof prisma.attachment.findFirst>> & {
      createdBy?: {
        id: string;
        displayName: string;
        email: string;
      } | null;
    })
  | null;

function mapAttachment(record: AttachmentRecord): DbAttachment | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    filename: record.filename,
    originalName: record.originalName,
    path: record.path,
    url: record.url,
    mimeType: record.mimeType,
    size: record.size,
    width: record.width,
    height: record.height,
    checksum: record.checksum,
    createdById: record.createdById,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    createdBy: record.createdBy
      ? {
          id: record.createdBy.id,
          displayName: record.createdBy.displayName,
          email: record.createdBy.email,
        }
      : null,
  };
}

function isRecordNotFoundError(error: unknown): error is { code?: string } {
  return (
    Boolean(error) &&
    typeof error === 'object' &&
    'code' in (error as Record<string, unknown>) &&
    (error as { code?: string }).code === 'P2025'
  );
}
