import { describe, expect, it } from 'vitest';

import {
  AppError,
  RateLimitError,
  UnauthorizedError,
  ValidationError,
  errorToResponse,
  toAppError,
} from '@/server/http/errors';

describe('http error helpers', () => {
  it('AppError stores code, message, status, and details', () => {
    const error = new AppError('boom', 418, 'TEAPOT', { hint: 'i am a teapot' });
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('TEAPOT');
    expect(error.message).toBe('boom');
    expect(error.statusCode).toBe(418);
    expect(error.details).toEqual({ hint: 'i am a teapot' });
  });

  it('ValidationError defaults to status 400 and code VALIDATION_ERROR', () => {
    const error = new ValidationError('bad input', { field: 'email' });
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.details).toEqual({ field: 'email' });
  });

  it('UnauthorizedError defaults to status 401', () => {
    const error = new UnauthorizedError('sign in');
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
  });

  it('RateLimitError defaults to status 429', () => {
    const error = new RateLimitError('slow down');
    expect(error.statusCode).toBe(429);
    expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
  });

  it('toAppError passes AppError through unchanged', () => {
    const original = new ValidationError('bad', { x: 1 });
    const result = toAppError(original);
    expect(result).toBe(original);
  });

  it('toAppError wraps a plain Error into a 500 AppError', () => {
    const result = toAppError(new Error('plain'));
    expect(result).toBeInstanceOf(AppError);
    expect(result.statusCode).toBe(500);
    expect(result.code).toBe('INTERNAL_ERROR');
    expect(result.message).toBe('plain');
  });

  it('toAppError wraps a string into a 500 AppError', () => {
    const result = toAppError('just a string');
    expect(result).toBeInstanceOf(AppError);
    expect(result.statusCode).toBe(500);
    expect(result.code).toBe('INTERNAL_ERROR');
  });

  it('errorToResponse returns the public response shape without leaking internals', () => {
    const error = new AppError('database is down', 500, 'INTERNAL_ERROR', {
      stack: 'super-secret-stack',
    });
    const response = errorToResponse(error);
    expect(response.success).toBe(false);
    expect(response.error.code).toBe('INTERNAL_ERROR');
    expect(response.error.message).toBe('database is down');
    expect(response.error).not.toHaveProperty('stack');
  });
});
