/**
 * EducationRepository
 *
 * Provides access to education history records.
 */

import { Prisma } from '@prisma/client';

import prisma from '@/server/db/prisma';
import { parseJson } from '@/server/server-utils/json';

export interface DbEducation {
  id: string;
  institution: string;
  degree: string;
  field?: string | null;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  present: boolean;
  gpa?: string | null;
  achievements: string[];
  project?: string | null;
  displayOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationCreateData {
  id?: string;
  institution: string;
  degree: string;
  field?: string | null;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  present: boolean;
  gpa?: string | null;
  achievements: string[];
  project?: string | null;
  displayOrder: number;
  published: boolean;
}

export type EducationUpdateData = Partial<EducationCreateData>;

function mapEducation(
  record: Awaited<ReturnType<typeof prisma.education.findFirst>>,
): DbEducation | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    institution: record.institution,
    degree: record.degree,
    field: record.field,
    location: record.location,
    startDate: record.startDate,
    endDate: record.endDate,
    present: record.present,
    gpa: record.gpa,
    achievements: parseJson<string[]>(record.achievements, []),
    project: record.project,
    displayOrder: record.displayOrder,
    published: record.published,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const EducationRepository = {
  async findPublished(): Promise<DbEducation[]> {
    const records = await prisma.education.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
    });

    return records.map((record) => mapEducation(record)!).filter(Boolean);
  },

  async findAll(): Promise<DbEducation[]> {
    const records = await prisma.education.findMany({
      orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
    });

    return records.map((record) => mapEducation(record)!).filter(Boolean);
  },

  async findById(id: string): Promise<DbEducation | null> {
    const record = await prisma.education.findUnique({ where: { id } });
    return mapEducation(record);
  },

  async getNextDisplayOrder(): Promise<number> {
    const record = await prisma.education.findFirst({
      orderBy: [{ displayOrder: 'desc' }],
      select: { displayOrder: true },
    });

    return (record?.displayOrder ?? 0) + 1;
  },

  async create(data: EducationCreateData): Promise<DbEducation> {
    const record = await prisma.education.create({
      data: toCreateData(data),
    });

    return mapEducation(record)!;
  },

  async update(id: string, data: EducationUpdateData): Promise<DbEducation | null> {
    try {
      const record = await prisma.education.update({
        where: { id },
        data: toUpdateData(data),
      });

      return mapEducation(record)!;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }

      throw error;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.education.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }

      throw error;
    }
  },
};

function toCreateData(data: EducationCreateData) {
  return {
    id: data.id,
    institution: data.institution,
    degree: data.degree,
    field: data.field ?? null,
    location: data.location ?? null,
    startDate: data.startDate,
    endDate: data.endDate ?? null,
    present: data.present,
    gpa: data.gpa ?? null,
    achievements: JSON.stringify(data.achievements ?? []),
    project: data.project ?? null,
    displayOrder: data.displayOrder,
    published: data.published,
  };
}

function toUpdateData(data: EducationUpdateData) {
  const update: Record<string, unknown> = {};

  if (data.institution !== undefined) update.institution = data.institution;
  if (data.degree !== undefined) update.degree = data.degree;
  if (data.field !== undefined) update.field = data.field ?? null;
  if (data.location !== undefined) update.location = data.location ?? null;
  if (data.startDate !== undefined) update.startDate = data.startDate;
  if (data.endDate !== undefined) update.endDate = data.endDate ?? null;
  if (data.present !== undefined) update.present = data.present;
  if (data.gpa !== undefined) update.gpa = data.gpa ?? null;
  if (data.achievements !== undefined)
    update.achievements = JSON.stringify(data.achievements ?? []);
  if (data.project !== undefined) update.project = data.project ?? null;
  if (data.displayOrder !== undefined) update.displayOrder = data.displayOrder;
  if (data.published !== undefined) update.published = data.published;

  return update;
}
