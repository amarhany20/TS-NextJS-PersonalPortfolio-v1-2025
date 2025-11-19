import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { SkillService } from '@/server/services/SkillService';
import { updateSkillGroupSchema } from '@/server/server-validators/api/skill';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const skillGroup = await SkillService.getSkillGroupBySlug(params.slug);

    if (!skillGroup) {
      return notFoundResponse('Skill group not found');
    }

    return successResponse({ skillGroup });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = updateSkillGroupSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const skillGroup = await SkillService.updateSkillGroup(params.slug, result.data);
    return successResponse({ skillGroup });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    await SkillService.deleteSkillGroup(params.slug);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
