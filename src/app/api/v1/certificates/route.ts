import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { CertificateService } from '@/server/services/CertificateService';
import { createCertificateSchema } from '@/server/server-validators/api/certificate';
import { revalidatePublicPages } from '@/server/server-utils/revalidate';

export async function GET() {
  try {
    await requireAuth();
    const certificates = await CertificateService.getCertificates();
    return successResponse({ certificates });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = createCertificateSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const certificate = await CertificateService.createCertificate(result.data);
    revalidatePublicPages();
    return successResponse({ certificate }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
