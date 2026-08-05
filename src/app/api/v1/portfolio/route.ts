import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { PortfolioService } from '@/server/services/PortfolioService';
import { createProjectSchema } from '@/server/server-validators/api/portfolio';
import { revalidatePublicPages } from '@/server/server-utils/revalidate';

export async function GET() {
  try {
    await requireAuth();
    const projects = await PortfolioService.getAllProjects();
    return successResponse({ projects });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = createProjectSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const project = await PortfolioService.createProject(result.data);
    revalidatePublicPages({ portfolioSlug: project.slug });
    return successResponse({ project }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
