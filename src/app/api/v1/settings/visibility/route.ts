import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { SettingsService } from '@/server/services/SettingsService';
import { updateSiteVisibilitySchema } from '@/server/server-validators/settings';

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = updateSiteVisibilitySchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const visibility = await SettingsService.updateSiteVisibility(result.data);

    revalidatePath('/', 'layout');
    revalidatePath('/home');
    revalidatePath('/portfolio');
    revalidatePath('/services');
    revalidatePath('/blogs');
    revalidatePath('/admin');

    return successResponse({ visibility });
  } catch (error) {
    return errorResponse(error);
  }
}