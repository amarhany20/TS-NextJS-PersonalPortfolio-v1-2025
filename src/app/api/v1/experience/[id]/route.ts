import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { ExperienceService } from '@/server/services/ExperienceService';
import { updateExperienceSchema } from '@/server/server-validators/api/experience';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const experience = await ExperienceService.getExperienceById(params.id);

    if (!experience) {
      return notFoundResponse('Experience not found');
    }

    return successResponse({ experience });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = updateExperienceSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const experience = await ExperienceService.updateExperience(params.id, result.data);
    return successResponse({ experience });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    await ExperienceService.deleteExperience(params.id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
