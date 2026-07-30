/**
 * PortfolioRepository
 *
 * Data-access helpers for portfolio projects.
 */

import { Prisma } from '@prisma/client';

import prisma from '@/server/db/prisma';
import { parseJson } from '@/server/server-utils/json';

export interface DbPortfolioProject {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  intro: string;
  summary: string;
  featured: boolean;
  visibility: string;
  access: string;
  status: string;
  domain?: string | null;
  company?: string | null;
  client?: string | null;
  website?: string | null;
  repository?: string | null;
  role: string;
  startDate?: Date | null;
  endDate?: Date | null;
  stack: string[];
  features: string[];
  sections: unknown[];
  gallery: unknown[];
  confidentialNotes?: string | null;
  displayOrder: number;
  published: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioCreateData {
  slug: string;
  title: string;
  tagline: string;
  intro: string;
  summary: string;
  featured: boolean;
  visibility: string;
  access: string;
  status: string;
  domain?: string | null;
  company?: string | null;
  client?: string | null;
  website?: string | null;
  repository?: string | null;
  role: string;
  startDate?: Date | null;
  endDate?: Date | null;
  stack: string[];
  features?: string[];
  sections?: unknown[];
  gallery?: unknown[];
  confidentialNotes?: string | null;
  displayOrder: number;
  published: boolean;
  publishedAt?: Date | null;
}

export type PortfolioUpdateData = Partial<PortfolioCreateData>;

function mapProject(
  record: Awaited<ReturnType<typeof prisma.portfolio.findFirst>>,
): DbPortfolioProject | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    tagline: record.tagline,
    intro: record.intro,
    summary: record.summary,
    featured: record.featured,
    visibility: record.visibility,
    access: record.access,
    status: record.status,
    domain: record.domain,
    company: record.company,
    client: record.client,
    website: record.website,
    repository: record.repository,
    role: record.role,
    startDate: record.startDate,
    endDate: record.endDate,
    stack: parseJson<string[]>(record.stack, []),
    features: parseJson<string[]>(record.features, []),
    sections: parseJson<unknown[]>(record.sections, []),
    gallery: parseJson<unknown[]>(record.gallery, []),
    confidentialNotes: record.confidentialNotes,
    displayOrder: record.displayOrder,
    published: record.published,
    publishedAt: record.publishedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const PortfolioRepository = {
  async findAll(): Promise<DbPortfolioProject[]> {
    const records = await prisma.portfolio.findMany({
      orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record) => mapProject(record)!).filter(Boolean);
  },

  async findPublished(): Promise<DbPortfolioProject[]> {
    const records = await prisma.portfolio.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }, { startDate: 'desc' }],
    });

    return records.map((record) => mapProject(record)!).filter(Boolean);
  },

  async findBySlug(slug: string): Promise<DbPortfolioProject | null> {
    const record = await prisma.portfolio.findUnique({
      where: { slug },
    });

    return mapProject(record);
  },

  async getNextDisplayOrder(): Promise<number> {
    const record = await prisma.portfolio.findFirst({
      orderBy: [{ displayOrder: 'desc' }],
      select: { displayOrder: true },
    });

    return (record?.displayOrder ?? 0) + 1;
  },

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const record = await prisma.portfolio.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    return Boolean(record);
  },

  async create(data: PortfolioCreateData): Promise<DbPortfolioProject> {
    const record = await prisma.portfolio.create({
      data: toCreateData(data),
    });

    return mapProject(record)!;
  },

  async update(slug: string, data: PortfolioUpdateData): Promise<DbPortfolioProject | null> {
    try {
      const record = await prisma.portfolio.update({
        where: { slug },
        data: toUpdateData(data),
      });

      return mapProject(record)!;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }

      throw error;
    }
  },

  async delete(slug: string): Promise<boolean> {
    try {
      await prisma.portfolio.delete({ where: { slug } });
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
        prisma.portfolio.update({
          where: { slug: update.slug },
          data: { displayOrder: update.displayOrder },
        }),
      ),
    );
  },
};

function toCreateData(data: PortfolioCreateData) {
  return {
    slug: data.slug,
    title: data.title,
    tagline: data.tagline,
    intro: data.intro,
    summary: data.summary,
    featured: data.featured,
    visibility: data.visibility,
    access: data.access,
    status: data.status,
    domain: data.domain ?? null,
    company: data.company ?? null,
    client: data.client ?? null,
    website: data.website ?? null,
    repository: data.repository ?? null,
    role: data.role,
    startDate: data.startDate ?? null,
    endDate: data.endDate ?? null,
    stack: JSON.stringify(data.stack ?? []),
    features: data.features ? JSON.stringify(data.features) : null,
    sections: data.sections ? JSON.stringify(data.sections) : null,
    gallery: data.gallery ? JSON.stringify(data.gallery) : null,
    confidentialNotes: data.confidentialNotes ?? null,
    displayOrder: data.displayOrder,
    published: data.published,
    publishedAt: data.published ? (data.publishedAt ?? new Date()) : null,
  };
}

function toUpdateData(data: PortfolioUpdateData) {
  const update: Record<string, unknown> = {};

  if (data.title !== undefined) update.title = data.title;
  if (data.slug !== undefined) update.slug = data.slug;
  if (data.tagline !== undefined) update.tagline = data.tagline;
  if (data.intro !== undefined) update.intro = data.intro;
  if (data.summary !== undefined) update.summary = data.summary;
  if (data.featured !== undefined) update.featured = data.featured;
  if (data.visibility !== undefined) update.visibility = data.visibility;
  if (data.access !== undefined) update.access = data.access;
  if (data.status !== undefined) update.status = data.status;
  if (data.domain !== undefined) update.domain = data.domain ?? null;
  if (data.company !== undefined) update.company = data.company ?? null;
  if (data.client !== undefined) update.client = data.client ?? null;
  if (data.website !== undefined) update.website = data.website ?? null;
  if (data.repository !== undefined) update.repository = data.repository ?? null;
  if (data.role !== undefined) update.role = data.role;
  if (data.startDate !== undefined) update.startDate = data.startDate ?? null;
  if (data.endDate !== undefined) update.endDate = data.endDate ?? null;
  if (data.stack !== undefined) update.stack = JSON.stringify(data.stack ?? []);
  if (data.features !== undefined)
    update.features = data.features ? JSON.stringify(data.features) : null;
  if (data.sections !== undefined)
    update.sections = data.sections ? JSON.stringify(data.sections) : null;
  if (data.gallery !== undefined)
    update.gallery = data.gallery ? JSON.stringify(data.gallery) : null;
  if (data.confidentialNotes !== undefined)
    update.confidentialNotes = data.confidentialNotes ?? null;
  if (data.displayOrder !== undefined) update.displayOrder = data.displayOrder;
  if (data.published !== undefined) update.published = data.published;
  if (data.publishedAt !== undefined) update.publishedAt = data.publishedAt ?? null;

  return update;
}
