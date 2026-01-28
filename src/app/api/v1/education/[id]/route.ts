import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { EducationService } from '@/server/services/EducationService';
import { updateEducationSchema } from '@/server/server-validators/api/education';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const education = await EducationService.getEducationById(id);

    if (!education) {
      return notFoundResponse('Education record not found');
    }

    return successResponse({ education });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const result = updateEducationSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const education = await EducationService.updateEducation(id, result.data);
    return successResponse({ education });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    await EducationService.deleteEducation(id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
