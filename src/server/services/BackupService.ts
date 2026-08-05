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
        blogCategories,
        blogTags,
        contentVersions,
        experiences,
        educations,
        skillGroups,
        skills,
        services,
        certificates,
        recommendations,
        attachments,
        contactSubmissions,
      ] = await Promise.all([
        prisma.settings.findMany(),
        prisma.user.findMany(),
        prisma.portfolio.findMany(),
        prisma.blog.findMany(),
        prisma.category.findMany(),
        prisma.tag.findMany(),
        prisma.blogCategory.findMany(),
        prisma.blogTag.findMany(),
        prisma.contentVersion.findMany(),
        prisma.experience.findMany(),
        prisma.education.findMany(),
        prisma.skillGroup.findMany(),
        prisma.skill.findMany(),
        prisma.service.findMany(),
        prisma.certificate.findMany(),
        prisma.recommendation.findMany(),
        prisma.attachment.findMany(),
        prisma.contactSubmission.findMany(),
      ]);

      const counts = {
        settings: settings.length,
        users: users.length,
        portfolio: portfolio.length,
        blogs: blogs.length,
        categories: categories.length,
        tags: tags.length,
        blogCategories: blogCategories.length,
        blogTags: blogTags.length,
        contentVersions: contentVersions.length,
        experiences: experiences.length,
        educations: educations.length,
        skillGroups: skillGroups.length,
        skills: skills.length,
        services: services.length,
        certificates: certificates.length,
        recommendations: recommendations.length,
        attachments: attachments.length,
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
          blogCategories: blogCategories as Record<string, unknown>[],
          blogTags: blogTags as Record<string, unknown>[],
          contentVersions: contentVersions as Record<string, unknown>[],
          experiences: experiences as Record<string, unknown>[],
          educations: educations as Record<string, unknown>[],
          skillGroups: skillGroups as Record<string, unknown>[],
          skills: skills as Record<string, unknown>[],
          services: services as Record<string, unknown>[],
          certificates: certificates as Record<string, unknown>[],
          recommendations: recommendations as Record<string, unknown>[],
          attachments: attachments as Record<string, unknown>[],
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

      // True snapshot restore wipes and recreates every collection, which can
      // exceed Prisma's default 5s interactive-transaction timeout on a
      // populated database — allow a generous window.
      await prisma.$transaction(
        async (tx) => {
          // True snapshot restore: wipe every collection unconditionally so the
          // resulting database matches the backup exactly (no hybrid state, no
          // stale rows left behind when a collection is absent from the backup).
          await tx.contentVersion.deleteMany({});
          await tx.blogTag.deleteMany({});
          await tx.blogCategory.deleteMany({});
          await tx.attachment.deleteMany({});
          await tx.contactSubmission.deleteMany({});
          await tx.recommendation.deleteMany({});
          await tx.certificate.deleteMany({});
          await tx.service.deleteMany({});
          await tx.education.deleteMany({});
          await tx.experience.deleteMany({});
          await tx.portfolio.deleteMany({});
          await tx.skill.deleteMany({});
          await tx.skillGroup.deleteMany({});
          await tx.tag.deleteMany({});
          await tx.category.deleteMany({});
          await tx.blog.deleteMany({});
          await tx.user.deleteMany({});
          await tx.settings.deleteMany({});

          // Users and settings first: attachments/contentVersions reference
          // `createdById` (FK to User), so the owner rows must exist before any
          // created-by relation is recreated.
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

          // Content domains (no FK dependencies on one another in restore order).
          for (const item of payload.data.portfolio) {
            await tx.portfolio.create({ data: item as unknown as Prisma.PortfolioCreateInput });
            totalRestored++;
          }

          for (const item of payload.data.blogs) {
            await tx.blog.create({ data: item as unknown as Prisma.BlogCreateInput });
            totalRestored++;
          }

          for (const item of payload.data.categories) {
            await tx.category.create({ data: item as unknown as Prisma.CategoryCreateInput });
            totalRestored++;
          }

          for (const item of payload.data.tags) {
            await tx.tag.create({ data: item as unknown as Prisma.TagCreateInput });
            totalRestored++;
          }

          // Blog/category/tag join rows: blogs, categories, and tags now exist,
          // so the associations can be recreated without FK failures.
          for (const item of payload.data.blogCategories) {
            await tx.blogCategory.create({
              data: item as unknown as Prisma.BlogCategoryCreateInput,
            });
            totalRestored++;
          }

          for (const item of payload.data.blogTags) {
            await tx.blogTag.create({ data: item as unknown as Prisma.BlogTagCreateInput });
            totalRestored++;
          }

          for (const item of payload.data.contentVersions) {
            const input = item as Record<string, unknown>;
            const createdById = input.createdById;
            const userExists = payload.data.users.some(
              (user) => user.id === createdById || user.username === createdById,
            );
            const { createdById: discardCreatedById, ...rest } = input;
            void discardCreatedById;
            const createInput: Prisma.ContentVersionCreateInput = {
              ...(rest as unknown as Prisma.ContentVersionCreateInput),
              createdBy: userExists ? { connect: { id: createdById as string } } : undefined,
            };
            await tx.contentVersion.create({ data: createInput });
            totalRestored++;
          }

          for (const sg of payload.data.skillGroups) {
            await tx.skillGroup.create({ data: sg as unknown as Prisma.SkillGroupCreateInput });
            totalRestored++;
          }

          for (const sk of payload.data.skills) {
            await tx.skill.create({ data: sk as unknown as Prisma.SkillCreateInput });
            totalRestored++;
          }

          for (const item of payload.data.experiences) {
            await tx.experience.create({ data: item as unknown as Prisma.ExperienceCreateInput });
            totalRestored++;
          }

          for (const item of payload.data.educations) {
            await tx.education.create({ data: item as unknown as Prisma.EducationCreateInput });
            totalRestored++;
          }

          for (const item of payload.data.services) {
            await tx.service.create({ data: item as unknown as Prisma.ServiceCreateInput });
            totalRestored++;
          }

          for (const item of payload.data.certificates) {
            await tx.certificate.create({ data: item as unknown as Prisma.CertificateCreateInput });
            totalRestored++;
          }

          for (const item of payload.data.recommendations) {
            await tx.recommendation.create({
              data: item as unknown as Prisma.RecommendationCreateInput,
            });
            totalRestored++;
          }

          for (const item of payload.data.contactSubmissions) {
            await tx.contactSubmission.create({
              data: item as unknown as Prisma.ContactSubmissionCreateInput,
            });
            totalRestored++;
          }

          for (const item of payload.data.attachments) {
            const input = item as Record<string, unknown>;
            // Safety net: null out `createdById` when the referenced user is not
            // present in the backup, otherwise the FK constraint would fail and
            // roll back the whole restore.
            const createdById = input.createdById;
            const userExists = payload.data.users.some(
              (user) => user.id === createdById || user.username === createdById,
            );
            const { createdById: discardCreatedById, ...rest } = input;
            void discardCreatedById;
            const createInput: Prisma.AttachmentCreateInput = {
              ...(rest as unknown as Prisma.AttachmentCreateInput),
              createdBy: userExists ? { connect: { id: createdById as string } } : undefined,
            };
            await tx.attachment.create({ data: createInput });
            totalRestored++;
          }
        },
        { timeout: 60_000, maxWait: 30_000 },
      );

      logger.info('Database backup restored successfully', { totalRestored });
      return { success: true, totalRestored };
    } catch (error) {
      logger.error('Failed to import database backup during transaction', error);
      throw error;
    }
  },
};
