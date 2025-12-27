import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { RecommendationService } from '@/server/services/RecommendationService';
import { updateRecommendationSchema } from '@/server/server-validators/api/recommendation';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;
    const recommendation = await RecommendationService.getRecommendationById(id);

    if (!recommendation) {
      return notFoundResponse('Recommendation not found');
    }

    return successResponse({ recommendation });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const result = updateRecommendationSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const recommendation = await RecommendationService.updateRecommendation(id, result.data);
    return successResponse({ recommendation });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;
    await RecommendationService.deleteRecommendation(id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
