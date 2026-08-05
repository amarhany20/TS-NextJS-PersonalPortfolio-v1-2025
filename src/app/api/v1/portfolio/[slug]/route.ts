import { NextRequest } from 'next/server';

import {
  errorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { PortfolioService } from '@/server/services/PortfolioService';
import { updateProjectSchema } from '@/server/server-validators/api/portfolio';
import { revalidatePublicPages } from '@/server/server-utils/revalidate';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    const project = await PortfolioService.getProjectForAdmin(slug);

    if (!project) {
      return notFoundResponse('Project not found');
    }

    return successResponse({ project });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await requireAuth();
    const { slug } = await params;
    const body = await request.json();
    const result = updateProjectSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const project = await PortfolioService.updateProject(slug, result.data);
    revalidatePublicPages({ portfolioSlug: slug });
    return successResponse({ project });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    await PortfolioService.deleteProject(slug);
    revalidatePublicPages();
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
