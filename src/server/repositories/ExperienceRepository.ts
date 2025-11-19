/**
 * ExperienceRepository
 *
 * Fetches professional experience records from the database.
 */

import { Prisma } from '@prisma/client';

import prisma from '@/server/db/prisma';
import { parseJson } from '@/server/server-utils/json';

export interface DbExperience {
  id: string;
  company: string;
  title: string;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  present: boolean;
  impact?: string | null;
  achievements: string[];
  skills: string[];
  companyUrl?: string | null;
  displayOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceCreateData {
  id?: string;
  company: string;
  title: string;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  present: boolean;
  impact?: string | null;
  achievements: string[];
  skills: string[];
  companyUrl?: string | null;
  displayOrder: number;
  published: boolean;
}

export type ExperienceUpdateData = Partial<ExperienceCreateData>;

function mapExperience(record: Awaited<ReturnType<typeof prisma.experience.findFirst>>): DbExperience | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    company: record.company,
    title: record.title,
    location: record.location,
    startDate: record.startDate,
    endDate: record.endDate,
    present: record.present,
    impact: record.impact,
    achievements: parseJson<string[]>(record.achievements, []),
    skills: parseJson<string[]>(record.skills, []),
    companyUrl: record.companyUrl,
    displayOrder: record.displayOrder,
    published: record.published,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const ExperienceRepository = {
  async findPublished(): Promise<DbExperience[]> {
    const records = await prisma.experience.findMany({
      where: { published: true },
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'desc' },
      ],
    });

    return records.map((record) => mapExperience(record)!).filter(Boolean);
  },

  async findAll(): Promise<DbExperience[]> {
    const records = await prisma.experience.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'desc' },
      ],
    });

    return records.map((record) => mapExperience(record)!).filter(Boolean);
  },

  async findById(id: string): Promise<DbExperience | null> {
    const record = await prisma.experience.findUnique({ where: { id } });
    return mapExperience(record);
  },

  async getNextDisplayOrder(): Promise<number> {
    const record = await prisma.experience.findFirst({
      orderBy: [{ displayOrder: 'desc' }],
      select: { displayOrder: true },
    });

    return (record?.displayOrder ?? 0) + 1;
  },

  async create(data: ExperienceCreateData): Promise<DbExperience> {
    const record = await prisma.experience.create({
      data: toCreateData(data),
    });

    return mapExperience(record)!;
  },

  async update(id: string, data: ExperienceUpdateData): Promise<DbExperience | null> {
    try {
      const record = await prisma.experience.update({
        where: { id },
        data: toUpdateData(data),
      });

      return mapExperience(record)!;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }

      throw error;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.experience.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }

      throw error;
    }
  },
};

function toCreateData(data: ExperienceCreateData) {
  return {
    id: data.id,
    company: data.company,
    title: data.title,
    location: data.location ?? null,
    startDate: data.startDate,
    endDate: data.endDate ?? null,
    present: data.present,
    impact: data.impact ?? null,
    achievements: JSON.stringify(data.achievements ?? []),
    skills: JSON.stringify(data.skills ?? []),
    companyUrl: data.companyUrl ?? null,
    displayOrder: data.displayOrder,
    published: data.published,
  };
}

function toUpdateData(data: ExperienceUpdateData) {
  const update: Record<string, unknown> = {};

  if (data.company !== undefined) update.company = data.company;
  if (data.title !== undefined) update.title = data.title;
  if (data.location !== undefined) update.location = data.location ?? null;
  if (data.startDate !== undefined) update.startDate = data.startDate;
  if (data.endDate !== undefined) update.endDate = data.endDate ?? null;
  if (data.present !== undefined) update.present = data.present;
  if (data.impact !== undefined) update.impact = data.impact ?? null;
  if (data.achievements !== undefined) update.achievements = JSON.stringify(data.achievements ?? []);
  if (data.skills !== undefined) update.skills = JSON.stringify(data.skills ?? []);
  if (data.companyUrl !== undefined) update.companyUrl = data.companyUrl ?? null;
  if (data.displayOrder !== undefined) update.displayOrder = data.displayOrder;
  if (data.published !== undefined) update.published = data.published;

  return update;
}
