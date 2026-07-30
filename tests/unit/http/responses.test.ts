import { describe, expect, it } from 'vitest';

import {
  errorResponse,
  jsonResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/server/http/responses';
import { AppError } from '@/server/http/errors';

describe('http response helpers', () => {
  it('jsonResponse returns a JSON body with the requested status', async () => {
    const response = jsonResponse({ hello: 'world' }, 201);
    expect(response.status).toBe(201);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(await response.json()).toEqual({ hello: 'world' });
  });

  it('successResponse wraps data in the { success, data, meta } envelope', async () => {
    const response = successResponse({ id: 1 }, { page: 1, total: 10 });
    const body = await response.json();
    expect(body).toEqual({
      success: true,
      data: { id: 1 },
      meta: { page: 1, total: 10 },
    });
  });

  it('successResponse omits meta when not provided', async () => {
    const response = successResponse({ id: 1 });
    const body = await response.json();
    expect(body).toEqual({ success: true, data: { id: 1 } });
    expect(body).not.toHaveProperty('meta');
  });

  it('notFoundResponse returns a 404 envelope with NOT_FOUND code', async () => {
    const response = notFoundResponse('portfolio not found');
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      error: { code: 'NOT_FOUND', message: 'portfolio not found' },
    });
  });

  it('unauthorizedResponse returns a 401 envelope with UNAUTHORIZED code', async () => {
    const response = unauthorizedResponse('sign in required');
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.message).toBe('sign in required');
  });

  it('validationErrorResponse returns a 400 envelope with details', async () => {
    const response = validationErrorResponse('bad payload', { field: 'email' });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'bad payload', details: { field: 'email' } },
    });
  });

  it('errorResponse maps an AppError to a structured error envelope', async () => {
    const response = errorResponse(new AppError('Boom', 418, 'TEAPOT'));
    expect(response.status).toBe(418);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('TEAPOT');
    expect(body.error.message).toBe('Boom');
  });

  it('errorResponse maps a plain Error to a 500 INTERNAL_ERROR envelope', async () => {
    const response = errorResponse(new Error('plain failure'));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });
});
