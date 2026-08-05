import { NextRequest } from 'next/server';
import { z } from 'zod';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { AuthService } from '@/server/services/AuthService';
import { enforceRateLimit } from '@/server/security/rateLimit';
import { getSession } from '@/server/security/session';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Trust the right-most entry: a trusted proxy appends the real client IP
    // to the list, while the left-most entries are client-suppliable. Using
    // the last entry prevents an attacker from rotating the header to bypass
    // the throttle.
    const entries = forwardedFor
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
    const last = entries[entries.length - 1];
    if (last) {
      return last;
    }
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse('Invalid request body', validation.error.format());
    }

    const clientId = getClientIdentifier(request);
    enforceRateLimit(`auth:login:${clientId}`, { limit: 5, windowMs: 60_000 });

    const { username, password } = validation.data;
    const user = await AuthService.authenticate(username, password);

    const session = await getSession();
    session.user = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
    };
    session.lastActiveAt = Date.now();
    await session.save();

    return successResponse({
      user,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
