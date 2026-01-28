import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { SkillService } from '@/server/services/SkillService';
import { updateSkillGroupSchema } from '@/server/server-validators/api/skill';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    const skillGroup = await SkillService.getSkillGroupBySlug(slug);

    if (!skillGroup) {
      return notFoundResponse('Skill group not found');
    }

    return successResponse({ skillGroup });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    const body = await request.json();
    const result = updateSkillGroupSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const skillGroup = await SkillService.updateSkillGroup(slug, result.data);
    return successResponse({ skillGroup });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    await SkillService.deleteSkillGroup(slug);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}