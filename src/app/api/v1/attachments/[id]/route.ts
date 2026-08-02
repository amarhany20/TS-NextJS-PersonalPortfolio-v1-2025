import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { AttachmentService } from '@/server/services/AttachmentService';

export const runtime = 'nodejs';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;
    await AttachmentService.deleteAttachment(id);
    return successResponse({ id });
  } catch (error) {
    return errorResponse(error);
  }
}
