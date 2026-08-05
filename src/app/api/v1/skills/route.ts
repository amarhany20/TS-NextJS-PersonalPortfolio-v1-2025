import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { SkillService } from '@/server/services/SkillService';
import { createSkillGroupSchema } from '@/server/server-validators/api/skill';
import { revalidatePublicPages } from '@/server/server-utils/revalidate';

export async function GET() {
  try {
    await requireAuth();
    const skillGroups = await SkillService.getSkillGroups();
    return successResponse({ skillGroups });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = createSkillGroupSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const skillGroup = await SkillService.createSkillGroup(result.data);
    revalidatePublicPages();
    return successResponse({ skillGroup }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
