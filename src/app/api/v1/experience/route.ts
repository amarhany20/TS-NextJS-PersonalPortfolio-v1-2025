import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { ExperienceService } from '@/server/services/ExperienceService';
import { createExperienceSchema } from '@/server/server-validators/api/experience';

export async function GET() {
  try {
    await requireAuth();
    const experience = await ExperienceService.getAllExperience();
    return successResponse({ experience });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = createExperienceSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const item = await ExperienceService.createExperience(result.data);
    return successResponse({ experience: item }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
