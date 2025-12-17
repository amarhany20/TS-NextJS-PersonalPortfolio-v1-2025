import { errorResponse, successResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { ThemeService } from '@/server/services/ThemeService';

export async function GET() {
  try {
    await requireAuth();
    const payload = await ThemeService.listThemes();
    return successResponse(payload);
  } catch (error) {
    return errorResponse(error);
  }
}
