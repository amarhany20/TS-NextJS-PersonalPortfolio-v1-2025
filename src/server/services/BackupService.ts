import { Prisma } from '@prisma/client';
import prisma from '@/server/db/prisma';
import { logger } from '@/utils/logger';
import { backupEnvelopeSchema, type BackupEnvelope } from '@/server/server-validators/api/backup';

export const BackupService = {
  /**
   * Generates a full portable JSON backup payload of all database models.
   */
  async exportBackup(): Promise<BackupEnvelope> {
    try {
      const [
        settings,
        users,
        portfolio,
        blogs,
        categories,
        tags,
        experiences,
        educations,
        skillGroups,
        skills,
        services,
        certificates,
        recommendations,
        media,
        contactSubmissions,
      ] = await Promise.all([
        prisma.settings.findMany(),
        prisma.user.findMany(),
        prisma.portfolio.findMany(),
        prisma.blog.findMany(),
        prisma.category.findMany(),
        prisma.tag.findMany(),
        prisma.experience.findMany(),
        prisma.education.findMany(),
        prisma.skillGroup.findMany(),
        prisma.skill.findMany(),
        prisma.service.findMany(),
        prisma.certificate.findMany(),
        prisma.recommendation.findMany(),
        prisma.media.findMany(),
        prisma.contactSubmission.findMany(),
      ]);

      const counts = {
        settings: settings.length,
        users: users.length,
        portfolio: portfolio.length,
        blogs: blogs.length,
        categories: categories.length,
        tags: tags.length,
        experiences: experiences.length,
        educations: educations.length,
        skillGroups: skillGroups.length,
        skills: skills.length,
        services: services.length,
        certificates: certificates.length,
        recommendations: recommendations.length,
        media: media.length,
        contactSubmissions: contactSubmissions.length,
      };

      const totalRecords = Object.values(counts).reduce((acc, curr) => acc + curr, 0);

      logger.info('Database backup exported successfully', { totalRecords, counts });

      return {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        summary: {
          totalRecords,
          counts,
        },
        data: {
          settings: settings as Record<string, unknown>[],
          users: users as Record<string, unknown>[],
          portfolio: portfolio as Record<string, unknown>[],
          blogs: blogs as Record<string, unknown>[],
          categories: categories as Record<string, unknown>[],
          tags: tags as Record<string, unknown>[],
          experiences: experiences as Record<string, unknown>[],
          educations: educations as Record<string, unknown>[],
          skillGroups: skillGroups as Record<string, unknown>[],
          skills: skills as Record<string, unknown>[],
          services: services as Record<string, unknown>[],
          certificates: certificates as Record<string, unknown>[],
          recommendations: recommendations as Record<string, unknown>[],
          media: media as Record<string, unknown>[],
          contactSubmissions: contactSubmissions as Record<string, unknown>[],
        },
      };
    } catch (error) {
      logger.error('Failed to export database backup', error);
      throw error;
    }
  },

  /**
   * Validates and restores a database backup envelope inside an atomic transaction.
   */
  async importBackup(rawPayload: unknown): Promise<{ success: boolean; totalRestored: number }> {
    const parseResult = backupEnvelopeSchema.safeParse(rawPayload);

    if (!parseResult.success) {
      logger.warn('Failed to import backup: invalid schema payload', {
        errors: parseResult.error.flatten(),
      });
      throw new Error('Invalid backup file format.');
    }

    const payload = parseResult.data;

    try {
      let totalRestored = 0;

      await prisma.$transaction(async (tx) => {
        if (payload.data.contactSubmissions.length > 0) {
          await tx.contactSubmission.deleteMany({});
          for (const item of payload.data.contactSubmissions) {
            await tx.contactSubmission.create({ data: item as unknown as Prisma.ContactSubmissionCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.recommendations.length > 0) {
          await tx.recommendation.deleteMany({});
          for (const item of payload.data.recommendations) {
            await tx.recommendation.create({ data: item as unknown as Prisma.RecommendationCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.certificates.length > 0) {
          await tx.certificate.deleteMany({});
          for (const item of payload.data.certificates) {
            await tx.certificate.create({ data: item as unknown as Prisma.CertificateCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.services.length > 0) {
          await tx.service.deleteMany({});
          for (const item of payload.data.services) {
            await tx.service.create({ data: item as unknown as Prisma.ServiceCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.educations.length > 0) {
          await tx.education.deleteMany({});
          for (const item of payload.data.educations) {
            await tx.education.create({ data: item as unknown as Prisma.EducationCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.experiences.length > 0) {
          await tx.experience.deleteMany({});
          for (const item of payload.data.experiences) {
            await tx.experience.create({ data: item as unknown as Prisma.ExperienceCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.portfolio.length > 0) {
          await tx.portfolio.deleteMany({});
          for (const item of payload.data.portfolio) {
            await tx.portfolio.create({ data: item as unknown as Prisma.PortfolioCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.skillGroups.length > 0 || payload.data.skills.length > 0) {
          await tx.skill.deleteMany({});
          await tx.skillGroup.deleteMany({});
          for (const sg of payload.data.skillGroups) {
            await tx.skillGroup.create({ data: sg as unknown as Prisma.SkillGroupCreateInput });
            totalRestored++;
          }
          for (const sk of payload.data.skills) {
            await tx.skill.create({ data: sk as unknown as Prisma.SkillCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.categories.length > 0) {
          await tx.category.deleteMany({});
          for (const item of payload.data.categories) {
            await tx.category.create({ data: item as unknown as Prisma.CategoryCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.tags.length > 0) {
          await tx.tag.deleteMany({});
          for (const item of payload.data.tags) {
            await tx.tag.create({ data: item as unknown as Prisma.TagCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.blogs.length > 0) {
          await tx.blog.deleteMany({});
          for (const item of payload.data.blogs) {
            await tx.blog.create({ data: item as unknown as Prisma.BlogCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.media.length > 0) {
          await tx.media.deleteMany({});
          for (const item of payload.data.media) {
            await tx.media.create({ data: item as unknown as Prisma.MediaCreateInput });
            totalRestored++;
          }
        }

        if (payload.data.users.length > 0) {
          for (const item of payload.data.users) {
            const userInput = item as unknown as Prisma.UserCreateInput;
            const userUpdateInput = item as unknown as Prisma.UserUpdateInput;
            const username = (item.username as string) || 'admin';

            await tx.user.upsert({
              where: { username },
              update: userUpdateInput,
              create: userInput,
            });
            totalRestored++;
          }
        }

        if (payload.data.settings.length > 0) {
          for (const item of payload.data.settings) {
            const settingsInput = item as unknown as Prisma.SettingsCreateInput;
            const settingsUpdateInput = item as unknown as Prisma.SettingsUpdateInput;
            const settingsId = (item.id as string) || 'settings-singleton';

            await tx.settings.upsert({
              where: { id: settingsId },
              update: settingsUpdateInput,
              create: settingsInput,
            });
            totalRestored++;
          }
        }
      });

      logger.info('Database backup restored successfully', { totalRestored });
      return { success: true, totalRestored };
    } catch (error) {
      logger.error('Failed to import database backup during transaction', error);
      throw error;
    }
  },
};
