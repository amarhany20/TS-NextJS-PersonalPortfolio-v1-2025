/**
 * HTTP Response Helpers
 *
 * Consistent response formatting for API routes.
 * All route handlers should use these helpers.
 *
 * Usage:
 *   return jsonResponse({ user: userData }, 200);
 *   return successResponse(data, { page: 1, total: 100 });
 *   return errorResponse(error);
 */

import { NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
import { errorToResponse, toAppError } from './errors';

/**
 * Success response envelope
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * Create a JSON response with proper headers
 */
export function jsonResponse<T>(
  data: T,
  status: number = 200,
  headers?: HeadersInit,
): NextResponse<T> {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

/**
 * Create a success response
 */
export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>,
  status: number = 200,
): NextResponse<SuccessResponse<T>> {
  return jsonResponse(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    status,
  );
}

/**
 * Create an error response from an error object
 */
export function errorResponse(error: unknown): NextResponse {
  const appError = toAppError(error);
  const response = errorToResponse(appError);

  if (appError.statusCode >= 500) {
    logger.error(`[API 500] Internal server error: ${appError.message}`, error);
  } else {
    logger.warn(`[API ${appError.statusCode}] ${appError.code}: ${appError.message}`);
  }

  return jsonResponse(response, appError.statusCode);
}

/**
 * Create a 404 response
 */
export function notFoundResponse(message: string = 'Resource not found'): NextResponse {
  logger.warn(`[API 404] Not Found: ${message}`);
  return jsonResponse(
    {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message,
      },
    },
    404,
  );
}

/**
 * Create a 401 response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  logger.warn(`[API 401] Unauthorized access attempt: ${message}`);
  return jsonResponse(
    {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message,
      },
    },
    401,
  );
}

/**
 * Create a 400 validation error response
 */
export function validationErrorResponse(message: string, details?: unknown): NextResponse {
  logger.warn(`[API 400] Validation Error: ${message}`, { details });
  return jsonResponse(
    {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message,
        details,
      },
    },
    400,
  );
}
