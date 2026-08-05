import { NextRequest } from 'next/server';

import { errorResponse, successResponse, validationErrorResponse } from '@/server/http/responses';
import { requireAuth } from '@/server/security/session';
import { enforceRateLimit } from '@/server/security/rateLimit';
import { ContactSubmissionService } from '@/server/services/ContactSubmissionService';
import { contactSubmissionSchema } from '@/server/server-validators/api/contact';
import { CONTACT_SUBMISSION_STATUSES, type ContactSubmissionStatus } from '@/types/contact';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = contactSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse('Invalid contact submission', parsed.error.format());
    }

    const rateKey = resolveRateLimitKey(request);
    enforceRateLimit(`contact:${rateKey}`, { limit: 5, windowMs: 15 * 60 * 1000 });

    const submission = await ContactSubmissionService.submitContact(parsed.data);
    return successResponse(submission, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const statusParam = request.nextUrl.searchParams.get('status');
    let status: ContactSubmissionStatus | undefined;

    if (statusParam) {
      if (!CONTACT_SUBMISSION_STATUSES.includes(statusParam as ContactSubmissionStatus)) {
        return validationErrorResponse('Invalid status filter');
      }

      status = statusParam as ContactSubmissionStatus;
    }

    const submissions = await ContactSubmissionService.listSubmissions({ status });
    return successResponse({ submissions });
  } catch (error) {
    return errorResponse(error);
  }
}

function resolveRateLimitKey(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Trust the right-most entry: a trusted proxy appends the real client IP.
    const entries = forwardedFor
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
    const last = entries[entries.length - 1];
    if (last) {
      return last;
    }
  }

  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-client-ip') ??
    'anonymous'
  );
}
