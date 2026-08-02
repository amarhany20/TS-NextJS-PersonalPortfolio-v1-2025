import { requireAuth } from '@/server/security/session';
import { verifyPassword } from '@/server/security/password';
import prisma from '@/server/db/prisma';
import { errorResponse, successResponse } from '@/server/http/responses';
import { logger } from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return errorResponse(new Error('Password is required.'));
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user!.id },
    });

    if (!user) {
      return errorResponse(new Error('User not found.'));
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return errorResponse(new Error('Incorrect password. Purge aborted.'));
    }

    const counts: Record<string, number> = {};

    await prisma.$transaction(async (tx) => {
      counts.contentVersions = (await tx.contentVersion.deleteMany()).count;
      counts.media = (await tx.media.deleteMany()).count;
      counts.blogTags = (await tx.blogTag.deleteMany()).count;
      counts.blogCategories = (await tx.blogCategory.deleteMany()).count;
      counts.blogs = (await tx.blog.deleteMany()).count;
      counts.tags = (await tx.tag.deleteMany()).count;
      counts.categories = (await tx.category.deleteMany()).count;
      counts.portfolio = (await tx.portfolio.deleteMany()).count;
      counts.experience = (await tx.experience.deleteMany()).count;
      counts.education = (await tx.education.deleteMany()).count;
      counts.skills = (await tx.skill.deleteMany()).count;
      counts.skillGroups = (await tx.skillGroup.deleteMany()).count;
      counts.services = (await tx.service.deleteMany()).count;
      counts.certificates = (await tx.certificate.deleteMany()).count;
      counts.recommendations = (await tx.recommendation.deleteMany()).count;
      counts.contactSubmissions = (await tx.contactSubmission.deleteMany()).count;
    });

    const totalPurged = Object.values(counts).reduce((a, b) => a + b, 0);

    logger.warn('[API Purge] Database purged by admin', {
      purgedBy: session.user!.username,
      totalPurged,
      counts,
    });

    return successResponse({ totalPurged, counts });
  } catch (error) {
    logger.error('[API Purge] Failed to purge database', error);
    return errorResponse(error);
  }
}
