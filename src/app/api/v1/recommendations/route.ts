import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { RecommendationService } from '@/server/services/RecommendationService';
import { createRecommendationSchema } from '@/server/server-validators/api/recommendation';
import { revalidatePublicPages } from '@/server/server-utils/revalidate';

export async function GET() {
  try {
    await requireAuth();
    const recommendations = await RecommendationService.getAllRecommendations();
    return successResponse({ recommendations });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = createRecommendationSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const recommendation = await RecommendationService.createRecommendation(result.data);
    revalidatePublicPages();
    return successResponse({ recommendation }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
