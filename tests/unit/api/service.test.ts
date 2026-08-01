import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';

import { UnauthorizedError } from '@/server/http/errors';

vi.mock('@/server/services/ServiceService', () => ({
  ServiceService: {
    getAllServices: vi.fn(),
    createService: vi.fn(),
  },
}));

vi.mock('@/server/security/session', () => ({
  requireAuth: vi.fn(),
}));

const { ServiceService } = await import('@/server/services/ServiceService');
const { requireAuth } = await import('@/server/security/session');

import { GET, POST } from '@/app/api/v1/services/route';
import { createRequest } from './helpers';

afterEach(() => {
  vi.clearAllMocks();
});

describe('services api routes', () => {
  it('GET requires authentication', async () => {
    (requireAuth as unknown as Mock).mockRejectedValue(
      new UnauthorizedError('Authentication required'),
    );

    const response = await GET();

    expect(response.status).toBe(401);
    const payload = await response.json();
    expect(payload.success).toBe(false);
  });

  it('GET lists all services', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});
    (ServiceService.getAllServices as unknown as Mock).mockResolvedValue([{ slug: 'web-dev' }]);

    const response = await GET();

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.services).toHaveLength(1);
  });

  it('POST rejects a payload missing description', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});

    const response = await POST(createRequest('/api/v1/services', 'POST', { title: 'Web Dev' }));

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.success).toBe(false);
    expect(ServiceService.createService).not.toHaveBeenCalled();
  });

  it('POST creates a service and returns 201', async () => {
    (requireAuth as unknown as Mock).mockResolvedValue({});
    (ServiceService.createService as unknown as Mock).mockResolvedValue({ slug: 'web-dev' });

    const response = await POST(
      createRequest('/api/v1/services', 'POST', {
        title: 'Web Development',
        description: 'Custom websites and apps',
      }),
    );

    expect(response.status).toBe(201);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(ServiceService.createService).toHaveBeenCalledTimes(1);
  });
});
