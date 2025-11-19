import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { PortfolioService } from '@/server/services/PortfolioService';
import { updateProjectSchema } from '@/server/server-validators/api/portfolio';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const project = await PortfolioService.getProjectBySlug(params.slug);

    if (!project) {
      return notFoundResponse('Project not found');
    }

    return successResponse({ project });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = updateProjectSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const project = await PortfolioService.updateProject(params.slug, result.data);
    return successResponse({ project });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    await PortfolioService.deleteProject(params.slug);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
