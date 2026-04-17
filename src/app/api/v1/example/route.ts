/**
 * Lightweight diagnostics endpoint used for response-envelope checks and
 * Playwright readiness probing during local and isolated verification runs.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, validationErrorResponse } from '@/server/http/responses';

const querySchema = z.object({
  name: z.string().optional().default('World'),
});

/**
 * GET /api/v1/example
 *
 * Returns a small success payload for readiness and response-format checks.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validationResult = querySchema.safeParse(searchParams);

    if (!validationResult.success) {
      return validationErrorResponse(
        'Invalid query parameters',
        validationResult.error.format()
      );
    }

    const { name } = validationResult.data;
    const greeting = `Hello, ${name}!`;
    const timestamp = new Date().toISOString();
    const data = {
      message: greeting,
      timestamp,
    };

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * POST /api/v1/example
 *
 * Echoes a validated payload so request parsing and response wrappers can be
 * checked without touching a persisted domain.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const bodySchema = z.object({
      message: z.string().min(1, 'Message is required'),
    });

    const validationResult = bodySchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(
        'Invalid request body',
        validationResult.error.format()
      );
    }

    const { message } = validationResult.data;
    const echo = {
      received: message,
      length: message.length,
      timestamp: new Date().toISOString(),
    };

    return successResponse(echo, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
