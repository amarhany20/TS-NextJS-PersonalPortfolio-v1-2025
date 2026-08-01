import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';

import { UnauthorizedError } from '@/server/http/errors';

vi.mock('@/server/services/ContactSubmissionService', () => ({
  ContactSubmissionService: {
    submitContact: vi.fn(),
    listSubmissions: vi.fn(),
  },
}));

vi.mock('@/server/security/session', () => ({
  requireAuth: vi.fn(),
}));

vi.mock('@/server/security/rateLimit', () => ({
  enforceRateLimit: vi.fn(),
}));

const { ContactSubmissionService } = await import('@/server/services/ContactSubmissionService');
const { requireAuth } = await import('@/server/security/session');
const { enforceRateLimit } = await import('@/server/security/rateLimit');

import { GET, POST } from '@/app/api/v1/contact/route';
import { createRequest } from './helpers';

afterEach(() => {
  vi.clearAllMocks();
});

describe('contact api routes', () => {
  it('POST rejects an invalid submission', async () => {
    const response = await POST(
      createRequest('/api/v1/contact', 'POST', {
        name: 'A',
        email: 'not-an-email',
        message: 'short',
      }),
    );

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(payload.error.code).toBe('VALIDATION_ERROR');
    expect(ContactSubmissionService.submitContact).not.toHaveBeenCalled();
  });

  it('POST accepts a valid submission and applies rate limiting', async () => {
    (ContactSubmissionService.submitContact as unknown as Mock).mockResolvedValue({
      id: 'msg-1',
    });

    const response = await POST(
      createRequest(
        '/api/v1/contact',
        'POST',
        {
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a valid message body.',
        },
        { 'x-forwarded-for': '203.0.113.9' },
      ),
    );

    expect(response.status).toBe(201);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(enforceRateLimit).toHaveBeenCalledWith(
      'contact:203.0.113.9',
      expect.objectContaining({ limit: 5 }),
    );
    expect(ContactSubmissionService.submitContact).toHaveBeenCalledTimes(1);
  });

  it('GET requires authentication', async () => {
    (requireAuth as unknown as Mock).mockRejectedValue(
      new UnauthorizedError('Authentication required'),
    );

    const response = await GET(createRequest('/api/v1/contact', 'GET'));

    expect(response.status).toBe(401);
    const payload = await response.json();
    expect(payload.success).toBe(false);
  });

  it('GET rejects an invalid status filter', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});

    const response = await GET(createRequest('/api/v1/contact?status=bogus', 'GET'));

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(ContactSubmissionService.listSubmissions).not.toHaveBeenCalled();
  });

  it('GET lists submissions with an optional status filter', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});
    (ContactSubmissionService.listSubmissions as unknown as Mock).mockResolvedValue([
      { id: 'msg-1' },
    ]);

    const response = await GET(createRequest('/api/v1/contact?status=new', 'GET'));

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.submissions).toHaveLength(1);
    expect(ContactSubmissionService.listSubmissions).toHaveBeenCalledWith({ status: 'new' });
  });
});
