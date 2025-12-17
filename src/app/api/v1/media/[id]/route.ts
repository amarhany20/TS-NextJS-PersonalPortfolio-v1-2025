import { errorResponse, successResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { MediaService } from '@/server/services/MediaService';

export const runtime = 'nodejs';

export async function DELETE(
  _request: Request,
  context: { params: { id: string } },
) {
  try {
    await requireAuth();
    await MediaService.deleteMedia(context.params.id);
    return successResponse({ id: context.params.id });
  } catch (error) {
    return errorResponse(error);
  }
}
