import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/server/http/responses';
import { enforceRateLimit } from '@/server/security/rateLimit';
import { destroySession, getSession } from '@/server/security/session';

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]!.trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientIdentifier(request);
    enforceRateLimit(`auth:logout:${clientId}`, { limit: 10, windowMs: 60_000 });

    const session = await getSession();

    if (session.user) {
      await destroySession(session);
    }

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
