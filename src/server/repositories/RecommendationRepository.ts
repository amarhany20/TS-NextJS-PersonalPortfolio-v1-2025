/**
 * RecommendationRepository
 *
 * Retrieves testimonial / recommendation records.
 */

import { Prisma } from '@prisma/client';

import prisma from '@/server/db/prisma';

export interface DbRecommendation {
  id: string;
  name: string;
  position?: string | null;
  company?: string | null;
  relationship?: string | null;
  content: string;
  rating?: number | null;
  linkedin?: string | null;
  recommendationLetterUrl?: string | null;
  photo?: string | null;
  receivedOn?: Date | null;
  displayOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecommendationCreateData {
  id?: string;
  name: string;
  position?: string | null;
  company?: string | null;
  relationship?: string | null;
  content: string;
  rating?: number | null;
  linkedin?: string | null;
  recommendationLetterUrl?: string | null;
  photo?: string | null;
  receivedOn?: Date | null;
  displayOrder: number;
  published: boolean;
}

export type RecommendationUpdateData = Partial<RecommendationCreateData>;

function mapRecommendation(
  record: Awaited<ReturnType<typeof prisma.recommendation.findFirst>>,
): DbRecommendation | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    name: record.name,
    position: record.position,
    company: record.company,
    relationship: record.relationship,
    content: record.content,
    rating: record.rating,
    linkedin: record.linkedin,
    recommendationLetterUrl: record.recommendationLetterUrl,
    photo: record.photo,
    receivedOn: record.receivedOn,
    displayOrder: record.displayOrder,
    published: record.published,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const RecommendationRepository = {
  async findPublished(): Promise<DbRecommendation[]> {
    const records = await prisma.recommendation.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: 'asc' }, { receivedOn: 'desc' }],
    });

    return records.map((record) => mapRecommendation(record)!).filter(Boolean);
  },

  async findAll(): Promise<DbRecommendation[]> {
    const records = await prisma.recommendation.findMany({
      orderBy: [{ displayOrder: 'asc' }, { receivedOn: 'desc' }],
    });

    return records.map((record) => mapRecommendation(record)!).filter(Boolean);
  },

  async findById(id: string): Promise<DbRecommendation | null> {
    const record = await prisma.recommendation.findUnique({ where: { id } });
    return mapRecommendation(record);
  },

  async getNextDisplayOrder(): Promise<number> {
    const record = await prisma.recommendation.findFirst({
      orderBy: [{ displayOrder: 'desc' }],
      select: { displayOrder: true },
    });

    return (record?.displayOrder ?? 0) + 1;
  },

  async create(data: RecommendationCreateData): Promise<DbRecommendation> {
    const record = await prisma.recommendation.create({
      data: toCreateData(data),
    });

    return mapRecommendation(record)!;
  },

  async update(id: string, data: RecommendationUpdateData): Promise<DbRecommendation | null> {
    try {
      const record = await prisma.recommendation.update({
        where: { id },
        data: toUpdateData(data),
      });

      return mapRecommendation(record)!;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }

      throw error;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.recommendation.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }

      throw error;
    }
  },
};

function toCreateData(data: RecommendationCreateData) {
  return {
    id: data.id,
    name: data.name,
    position: data.position ?? null,
    company: data.company ?? null,
    relationship: data.relationship ?? null,
    content: data.content,
    rating: data.rating ?? null,
    linkedin: data.linkedin ?? null,
    recommendationLetterUrl: data.recommendationLetterUrl ?? null,
    photo: data.photo ?? null,
    receivedOn: data.receivedOn ?? null,
    displayOrder: data.displayOrder,
    published: data.published,
  };
}

function toUpdateData(data: RecommendationUpdateData) {
  const update: Record<string, unknown> = {};

  if (data.name !== undefined) update.name = data.name;
  if (data.position !== undefined) update.position = data.position ?? null;
  if (data.company !== undefined) update.company = data.company ?? null;
  if (data.relationship !== undefined) update.relationship = data.relationship ?? null;
  if (data.content !== undefined) update.content = data.content;
  if (data.rating !== undefined) update.rating = data.rating ?? null;
  if (data.linkedin !== undefined) update.linkedin = data.linkedin ?? null;
  if (data.recommendationLetterUrl !== undefined)
    update.recommendationLetterUrl = data.recommendationLetterUrl ?? null;
  if (data.photo !== undefined) update.photo = data.photo ?? null;
  if (data.receivedOn !== undefined) update.receivedOn = data.receivedOn ?? null;
  if (data.displayOrder !== undefined) update.displayOrder = data.displayOrder;
  if (data.published !== undefined) update.published = data.published;

  return update;
}
