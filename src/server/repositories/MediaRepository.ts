import prisma from '@/server/db/prisma';

export interface DbMedia {
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

export interface MediaCreateData {
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

export class MediaRepository {
  static async findAll(): Promise<DbMedia[]> {
    const records = await prisma.media.findMany({
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

    return records.map(mapMedia).filter(Boolean) as DbMedia[];
  }

  static async findById(id: string): Promise<DbMedia | null> {
    const record = await prisma.media.findUnique({
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

    return record ? mapMedia(record) : null;
  }

  static async create(data: MediaCreateData): Promise<DbMedia> {
    const record = await prisma.media.create({
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

    return mapMedia(record)!;
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.media.delete({ where: { id } });
      return true;
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        return false;
      }

      throw error;
    }
  }
}

type MediaRecord =
  | (Awaited<ReturnType<typeof prisma.media.findFirst>> & {
      createdBy?: {
        id: string;
        displayName: string;
        email: string;
      } | null;
    })
  | null;

function mapMedia(record: MediaRecord): DbMedia | null {
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
