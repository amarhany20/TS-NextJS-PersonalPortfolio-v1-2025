import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { CertificateService } from '@/server/services/CertificateService';
import { updateCertificateSchema } from '@/server/server-validators/api/certificate';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const certificate = await CertificateService.getCertificateById(id);

    if (!certificate) {
      return notFoundResponse('Certificate not found');
    }

    return successResponse({ certificate });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const result = updateCertificateSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const certificate = await CertificateService.updateCertificate(id, result.data);
    return successResponse({ certificate });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    await CertificateService.deleteCertificate(id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
