import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { ContactSubmissionService } from '@/server/services/ContactSubmissionService';
import { contactStatusSchema } from '@/server/server-validators/api/contact';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = contactStatusSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse('Invalid status update payload', parsed.error.format());
    }

    const submission = await ContactSubmissionService.updateSubmissionStatus(
      id,
      parsed.data.status,
    );

    return successResponse(submission);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    await ContactSubmissionService.deleteSubmission(params.id);
    return successResponse({ id: params.id });
  } catch (error) {
    return errorResponse(error);
  }
}
