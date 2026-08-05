import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { ServiceService } from '@/server/services/ServiceService';
import { reorderServicesSchema } from '@/server/server-validators/api/service';
import { revalidatePublicPages } from '@/server/server-utils/revalidate';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const result = reorderServicesSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse('Invalid request body', result.error.format());
    }

    const updates = await ServiceService.reorderServices(result.data.slugs);
    revalidatePublicPages();
    return successResponse({ updates });
  } catch (error) {
    return errorResponse(error);
  }
}
