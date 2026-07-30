import prisma from '@/server/db/prisma';
import { parseJson } from '@/server/server-utils/json';
import type { ContactSubmissionStatus } from '@/types/contact';

export interface DbContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: ContactSubmissionStatus;
  meta?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContactSubmissionData {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status?: ContactSubmissionStatus;
  meta?: Record<string, unknown> | null;
}

type PrismaContactSubmission = Awaited<ReturnType<typeof prisma.contactSubmission.findFirst>>;

export class ContactSubmissionRepository {
  static async create(data: CreateContactSubmissionData): Promise<DbContactSubmission> {
    const record = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        subject: data.subject ?? null,
        message: data.message,
        status: data.status ?? 'new',
        meta: data.meta ? JSON.stringify(data.meta) : null,
      },
    });

    return mapSubmission(record)!;
  }

  static async findAll(
    filter: { status?: ContactSubmissionStatus } = {},
  ): Promise<DbContactSubmission[]> {
    const records = await prisma.contactSubmission.findMany({
      where: filter.status ? { status: filter.status } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record: PrismaContactSubmission) => mapSubmission(record)!).filter(Boolean);
  }

  static async findById(id: string): Promise<DbContactSubmission | null> {
    const record = await prisma.contactSubmission.findUnique({ where: { id } });
    return mapSubmission(record);
  }

  static async updateStatus(
    id: string,
    status: ContactSubmissionStatus,
  ): Promise<DbContactSubmission | null> {
    try {
      const record = await prisma.contactSubmission.update({
        where: { id },
        data: { status },
      });

      return mapSubmission(record);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await prisma.contactSubmission.delete({ where: { id } });
      return true;
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        return false;
      }

      throw error;
    }
  }
}

function mapSubmission(record: PrismaContactSubmission | null): DbContactSubmission | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone,
    subject: record.subject,
    message: record.message,
    status: record.status as ContactSubmissionStatus,
    meta: parseJson<Record<string, unknown> | null>(record.meta, null),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
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
