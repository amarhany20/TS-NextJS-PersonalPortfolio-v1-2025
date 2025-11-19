import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { CertificateService } from '@/server/services/CertificateService';
import { updateCertificateSchema } from '@/server/server-validators/api/certificate';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const certificate = await CertificateService.getCertificateById(params.id);

    if (!certificate) {
      return notFoundResponse('Certificate not found');
    }

    return successResponse({ certificate });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = updateCertificateSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const certificate = await CertificateService.updateCertificate(params.id, result.data);
    return successResponse({ certificate });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    await CertificateService.deleteCertificate(params.id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
