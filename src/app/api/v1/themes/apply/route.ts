import { z } from 'zod';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { ThemeService } from '@/server/services/ThemeService';

const applyThemeSchema = z.object({
  themeId: z.string().min(1, 'themeId is required'),
});

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = applyThemeSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const theme = await ThemeService.applyTheme(result.data.themeId);
    revalidatePath('/', 'layout');
    return successResponse({ theme });
  } catch (error) {
    return errorResponse(error);
  }
}
