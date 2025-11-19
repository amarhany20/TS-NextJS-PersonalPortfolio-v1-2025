import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { ServiceService } from '@/server/services/ServiceService';
import { updateServiceSchema } from '@/server/server-validators/api/service';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const service = await ServiceService.getServiceBySlug(params.slug);

    if (!service) {
      return notFoundResponse('Service not found');
    }

    return successResponse({ service });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = updateServiceSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const service = await ServiceService.updateService(params.slug, result.data);
    return successResponse({ service });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    await ServiceService.deleteService(params.slug);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
