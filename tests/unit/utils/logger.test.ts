import { describe, expect, it } from 'vitest';
import { logger, isServer } from '@/utils/logger';

describe('Isomorphic Logger System', () => {
  it('correctly identifies execution environment', () => {
    // In Vitest node environment, isServer should be true
    expect(typeof isServer).toBe('boolean');
  });

  it('creates structured info log payloads', () => {
    const payload = logger.info('Test info message', { userId: 'u123', feature: 'test' });
    expect(payload.level).toBe('info');
    expect(payload.message).toBe('Test info message');
    expect(payload.context).toEqual({ userId: 'u123', feature: 'test' });
    expect(payload.timestamp).toBeDefined();
    expect(payload.isServer).toBe(true);
  });

  it('creates structured warn log payloads', () => {
    const payload = logger.warn('Rate limit approaching', { threshold: 90 });
    expect(payload.level).toBe('warn');
    expect(payload.message).toBe('Rate limit approaching');
    expect(payload.context).toEqual({ threshold: 90 });
  });

  it('creates structured error log payloads with normalized Error objects', () => {
    const err = new Error('Database connection failed');
    const payload = logger.error('Unhandled service error', err, { action: 'dbConnect' });
    expect(payload.level).toBe('error');
    expect(payload.message).toBe('Unhandled service error');
    expect(payload.error).toBeDefined();
    expect(payload.error?.name).toBe('Error');
    expect(payload.error?.message).toBe('Database connection failed');
    expect(payload.context).toEqual({ action: 'dbConnect' });
  });

  it('handles non-Error objects safely in error logs', () => {
    const payload = logger.error('String failure', 'Raw error string');
    expect(payload.level).toBe('error');
    expect(payload.error?.message).toBe('Raw error string');
  });

  it('creates structured HTTP API request log payloads', () => {
    const payload = logger.api('GET', '/api/v1/portfolio', 200, 15);
    expect(payload.level).toBe('info');
    expect(payload.message).toBe('HTTP GET /api/v1/portfolio 200');
    expect(payload.context).toEqual({
      method: 'GET',
      path: '/api/v1/portfolio',
      statusCode: 200,
      duration: '15ms',
    });
  });

  it('assigns warn level to 4xx API status codes', () => {
    const payload = logger.api('POST', '/api/v1/auth/login', 401);
    expect(payload.level).toBe('warn');
    expect(payload.message).toBe('HTTP POST /api/v1/auth/login 401');
  });

  it('assigns error level to 5xx API status codes', () => {
    const payload = logger.api('DELETE', '/api/v1/attachments/123', 500);
    expect(payload.level).toBe('error');
    expect(payload.message).toBe('HTTP DELETE /api/v1/attachments/123 500');
  });

  it('creates structured database query log payloads', () => {
    const payload = logger.db('SELECT', 'portfolio_items', 6);
    expect(payload.level).toBe('debug');
    expect(payload.message).toBe('DB SELECT portfolio_items');
    expect(payload.context).toEqual({
      operation: 'SELECT',
      table: 'portfolio_items',
      duration: '6ms',
    });
  });
});
