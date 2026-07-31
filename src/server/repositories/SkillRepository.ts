/**
 * SkillRepository
 *
 * Retrieves skill groups with their associated skills.
 */

import { Prisma } from '@prisma/client';

import prisma from '@/server/db/prisma';
import { env } from '@/server/server-validators/env';
import { logger } from '@/utils/logger';

export interface DbSkill {
  id: string;
  name: string;
  icon?: string | null;
  level?: string | null;
  keywords?: string[];
  displayOrder: number;
  groupId: string;
}

export interface DbSkillGroup {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  displayOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  skills: DbSkill[];
}

export interface SkillInput {
  id?: string;
  name: string;
  displayOrder?: number;
}

export interface SkillGroupCreateData {
  slug: string;
  title: string;
  summary?: string | null;
  displayOrder: number;
  published?: boolean;
  skills?: SkillInput[];
}

export type SkillGroupUpdateData = Partial<SkillGroupCreateData>;

export const SkillRepository = {
  async findAllGroups(): Promise<DbSkillGroup[]> {
    const groups = await prisma.skillGroup.findMany({
      orderBy: [{ displayOrder: 'asc' }, { title: 'asc' }],
      include: {
        skills: {
          orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        },
      },
    });

    return groups.map(mapSkillGroupRecord);
  },

  async findBySlug(slug: string): Promise<DbSkillGroup | null> {
    const group = await prisma.skillGroup.findUnique({
      where: { slug },
      include: {
        skills: {
          orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        },
      },
    });

    return group ? mapSkillGroupRecord(group) : null;
  },

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const record = await prisma.skillGroup.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    return Boolean(record);
  },

  async getNextDisplayOrder(): Promise<number> {
    const record = await prisma.skillGroup.findFirst({
      orderBy: [{ displayOrder: 'desc' }],
      select: { displayOrder: true },
    });

    return (record?.displayOrder ?? 0) + 1;
  },

  async createGroup(data: SkillGroupCreateData): Promise<DbSkillGroup> {
    const group = await prisma.skillGroup.create({
      data: {
        slug: data.slug,
        title: data.title,
        summary: data.summary ?? null,
        displayOrder: data.displayOrder,
        published: data.published ?? true,
        skills: data.skills?.length
          ? {
              create: data.skills.map((skill, index) => ({
                id: skill.id,
                name: skill.name,
                displayOrder: skill.displayOrder ?? index,
              })),
            }
          : undefined,
      },
      include: {
        skills: {
          orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
        },
      },
    });

    return mapSkillGroupRecord(group);
  },

  async updateGroup(slug: string, data: SkillGroupUpdateData): Promise<DbSkillGroup | null> {
    try {
      return await prisma.$transaction(async (tx) => {
        const updated = await tx.skillGroup.update({
          where: { slug },
          data: {
            ...(data.slug !== undefined ? { slug: data.slug } : {}),
            ...(data.title !== undefined ? { title: data.title } : {}),
            ...(data.summary !== undefined ? { summary: data.summary ?? null } : {}),
            ...(data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {}),
            ...(data.published !== undefined ? { published: data.published } : {}),
          },
        });

        if (data.skills !== undefined) {
          await tx.skill.deleteMany({ where: { groupId: updated.id } });

          if (data.skills.length) {
            await Promise.all(
              data.skills.map((skill, index) =>
                tx.skill.create({
                  data: {
                    id: skill.id,
                    name: skill.name,
                    groupId: updated.id,
                    displayOrder: skill.displayOrder ?? index,
                  },
                }),
              ),
            );
          }
        }

        const group = await tx.skillGroup.findUnique({
          where: { id: updated.id },
          include: {
            skills: {
              orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
            },
          },
        });

        return mapSkillGroupRecord(group!);
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }

      throw error;
    }
  },

  async deleteGroup(slug: string): Promise<boolean> {
    try {
      await prisma.skillGroup.delete({ where: { slug } });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return false;
      }

      throw error;
    }
  },
};

function safeParseKeywords(value: string): string[] {
  try {
    return JSON.parse(value) as string[];
  } catch (error) {
    if (env.NODE_ENV === 'development') {
      logger.warn('Failed to parse skill keywords JSON', { error });
    }
    return [];
  }
}

function mapSkillGroupRecord(group: {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  displayOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  skills: {
    id: string;
    name: string;
    icon: string | null;
    level: string | null;
    keywords: string | null;
    displayOrder: number;
    groupId: string;
  }[];
}): DbSkillGroup {
  return {
    id: group.id,
    slug: group.slug,
    title: group.title,
    summary: group.summary,
    displayOrder: group.displayOrder,
    published: group.published,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    skills: group.skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      icon: skill.icon,
      level: skill.level,
      keywords: skill.keywords ? safeParseKeywords(skill.keywords) : undefined,
      displayOrder: skill.displayOrder,
      groupId: skill.groupId,
    })),
  };
}
