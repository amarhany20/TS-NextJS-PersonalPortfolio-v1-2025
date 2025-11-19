import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { EducationService } from '@/server/services/EducationService';
import { updateEducationSchema } from '@/server/server-validators/api/education';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const education = await EducationService.getEducationById(params.id);

    if (!education) {
      return notFoundResponse('Education record not found');
    }

    return successResponse({ education });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = updateEducationSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const education = await EducationService.updateEducation(params.id, result.data);
    return successResponse({ education });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    await EducationService.deleteEducation(params.id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
