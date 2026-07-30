import { NextRequest } from 'next/server';

import {
  errorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { ExperienceService } from '@/server/services/ExperienceService';
import { updateExperienceSchema } from '@/server/server-validators/api/experience';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const experience = await ExperienceService.getExperienceById(id);

    if (!experience) {
      return notFoundResponse('Experience not found');
    }

    return successResponse({ experience });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const result = updateExperienceSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const experience = await ExperienceService.updateExperience(id, result.data);
    return successResponse({ experience });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    await ExperienceService.deleteExperience(id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
