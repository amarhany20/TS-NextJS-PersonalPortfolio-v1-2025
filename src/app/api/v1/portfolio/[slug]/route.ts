import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { PortfolioService } from '@/server/services/PortfolioService';
import { updateProjectSchema } from '@/server/server-validators/api/portfolio';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    const project = await PortfolioService.getProjectBySlug(slug);

    if (!project) {
      return notFoundResponse('Project not found');
    }

    return successResponse({ project });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    const body = await request.json();
    const result = updateProjectSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const project = await PortfolioService.updateProject(slug, result.data);
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
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}