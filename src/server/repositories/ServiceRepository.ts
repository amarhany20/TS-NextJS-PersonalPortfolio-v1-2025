/**
 * ServiceRepository
 *
 * Data access helpers for service offerings.
 */

import { Prisma } from '@prisma/client';

import prisma from '@/server/db/prisma';
import { parseJson } from '@/server/server-utils/json';

export interface DbService {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string | null;
  features: string[];
  technologies: string[];
  icon?: string | null;
  image?: string | null;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCreateData {
  id?: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string | null;
  features?: string[];
  technologies?: string[];
  icon?: string | null;
  image?: string | null;
  active: boolean;
  displayOrder: number;
}

export type ServiceUpdateData = Partial<ServiceCreateData>;

function mapService(
  record: Awaited<ReturnType<typeof prisma.service.findFirst>>,
): DbService | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    description: record.description,
    longDescription: record.longDescription,
    features: parseJson<string[]>(record.features, []),
    technologies: parseJson<string[]>(record.technologies, []),
    icon: record.icon,
    image: record.image,
    active: record.active,
    displayOrder: record.displayOrder,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const ServiceRepository = {
  async findActive(): Promise<DbService[]> {
    const records = await prisma.service.findMany({
      where: { active: true },
      orderBy: [{ displayOrder: 'asc' }],
    });

    return records.map((record) => mapService(record)!).filter(Boolean);
  },

  async findAll(): Promise<DbService[]> {
    const records = await prisma.service.findMany({
      orderBy: [{ displayOrder: 'asc' }],
    });

    return records.map((record) => mapService(record)!).filter(Boolean);
  },

  async findBySlug(slug: string): Promise<DbService | null> {
    const record = await prisma.service.findUnique({ where: { slug } });
    return mapService(record);
  },

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const record = await prisma.service.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    return Boolean(record);
  },

  async getNextDisplayOrder(): Promise<number> {
    const record = await prisma.service.findFirst({
      orderBy: [{ displayOrder: 'desc' }],
      select: { displayOrder: true },
    });

    return (record?.displayOrder ?? 0) + 1;
  },

  async create(data: ServiceCreateData): Promise<DbService> {
    const record = await prisma.service.create({
      data: toCreateData(data),
    });

    return mapService(record)!;
  },

  async update(slug: string, data: ServiceUpdateData): Promise<DbService | null> {
    try {
      const record = await prisma.service.update({
        where: { slug },
        data: toUpdateData(data),
      });

      return mapService(record)!;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }

      throw error;
    }
  },

  async delete(slug: string): Promise<boolean> {
    try {
      await prisma.service.delete({ where: { slug } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }

      throw error;
    }
  },

  async reorderDisplayOrder(updates: { slug: string; displayOrder: number }[]): Promise<void> {
    if (updates.length === 0) {
      return;
    }

    await prisma.$transaction(
      updates.map((update) =>
        prisma.service.update({
          where: { slug: update.slug },
          data: { displayOrder: update.displayOrder },
        }),
      ),
    );
  },
};

function toCreateData(data: ServiceCreateData) {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    longDescription: data.longDescription ?? null,
    features: data.features ? JSON.stringify(data.features) : null,
    technologies: data.technologies ? JSON.stringify(data.technologies) : null,
    icon: data.icon ?? null,
    image: data.image ?? null,
    active: data.active,
    displayOrder: data.displayOrder,
  };
}

function toUpdateData(data: ServiceUpdateData) {
  const update: Record<string, unknown> = {};

  if (data.slug !== undefined) update.slug = data.slug;
  if (data.title !== undefined) update.title = data.title;
  if (data.description !== undefined) update.description = data.description;
  if (data.longDescription !== undefined) update.longDescription = data.longDescription ?? null;
  if (data.features !== undefined)
    update.features = data.features ? JSON.stringify(data.features) : null;
  if (data.technologies !== undefined)
    update.technologies = data.technologies ? JSON.stringify(data.technologies) : null;
  if (data.icon !== undefined) update.icon = data.icon ?? null;
  if (data.image !== undefined) update.image = data.image ?? null;
  if (data.active !== undefined) update.active = data.active;
  if (data.displayOrder !== undefined) update.displayOrder = data.displayOrder;

  return update;
}
