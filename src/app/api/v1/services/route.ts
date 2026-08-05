import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { ServiceService } from '@/server/services/ServiceService';
import { createServiceSchema } from '@/server/server-validators/api/service';
import { revalidatePublicPages } from '@/server/server-utils/revalidate';

export async function GET() {
  try {
    await requireAuth();
    const services = await ServiceService.getAllServices();
    return successResponse({ services });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = createServiceSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const service = await ServiceService.createService(result.data);
    revalidatePublicPages();
    return successResponse({ service }, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
