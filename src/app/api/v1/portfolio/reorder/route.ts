import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { PortfolioService } from '@/server/services/PortfolioService';
import { reorderProjectsSchema } from '@/server/server-validators/api/portfolio';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = reorderProjectsSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const updates = await PortfolioService.reorderProjects(result.data.slugs);
    return successResponse({ updates });
  } catch (error) {
    return errorResponse(error);
  }
}
