import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { EducationService } from '@/server/services/EducationService';
import { createEducationSchema } from '@/server/server-validators/api/education';
import { revalidatePublicPages } from '@/server/server-utils/revalidate';

export async function GET() {
  try {
    await requireAuth();
    const education = await EducationService.getAllEducation();
    return successResponse({ education });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = createEducationSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const record = await EducationService.createEducation(result.data);
    revalidatePublicPages();
    return successResponse({ education: record }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
