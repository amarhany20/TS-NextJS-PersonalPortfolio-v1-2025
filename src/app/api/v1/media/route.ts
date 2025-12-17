import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { MediaService } from '@/server/services/MediaService';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireAuth();
    const media = await MediaService.getMediaLibrary();
    return successResponse({ media });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return validationErrorResponse('File input "file" is required');
    }

    const asset = await MediaService.uploadMedia({
      file,
      createdById: session.user?.id,
    });

    return successResponse(asset, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
