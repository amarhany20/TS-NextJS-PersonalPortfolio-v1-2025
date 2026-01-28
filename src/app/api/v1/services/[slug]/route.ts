import { NextRequest } from 'next/server';

import { errorResponse, notFoundResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { ServiceService } from '@/server/services/ServiceService';
import { updateServiceSchema } from '@/server/server-validators/api/service';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    const service = await ServiceService.getServiceBySlug(slug);

    if (!service) {
      return notFoundResponse('Service record not found');
    }

    return successResponse({ service });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    const body = await request.json();
    const result = updateServiceSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const service = await ServiceService.updateService(slug, result.data);
    return successResponse({ service });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth();
    const { slug } = await params;
    await ServiceService.deleteService(slug);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}