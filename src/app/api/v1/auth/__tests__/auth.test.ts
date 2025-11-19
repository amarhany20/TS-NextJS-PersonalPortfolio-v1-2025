import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';

vi.mock('@/server/services/AuthService', () => ({
  AuthService: {
    authenticate: vi.fn(),
  },
}));

vi.mock('@/server/security/session', () => ({
  getSession: vi.fn(),
  destroySession: vi.fn(),
}));

vi.mock('@/server/security/rateLimit', () => ({
  enforceRateLimit: vi.fn(),
}));

const { AuthService } = await import('@/server/services/AuthService');
const { getSession, destroySession } = await import('@/server/security/session');

import { POST as loginHandler } from '../login/route';
import { POST as logoutHandler } from '../logout/route';

function createRequest(url: string, method: string, body?: unknown): NextRequest {
  const init: RequestInit = {
    method,
    headers: {
      'content-type': 'application/json',
    },
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  return new NextRequest(new URL(url, 'http://localhost'), init);
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('auth api routes', () => {
  it('creates a session on successful login', async () => {
    const mockSession = {
      user: undefined,
      lastActiveAt: undefined as number | undefined,
      save: vi.fn().mockResolvedValue(undefined),
    };

    (getSession as unknown as Mock).mockResolvedValue(mockSession);
    (AuthService.authenticate as unknown as Mock).mockResolvedValue({
      id: 'user-1',
      username: 'admin',
      email: 'admin@example.com',
      displayName: 'Admin User',
      role: 'admin',
    });

    const response = await loginHandler(createRequest('/api/v1/auth/login', 'POST', {
      username: 'admin',
      password: 'password123',
    }));

    expect(mockSession.save).toHaveBeenCalled();

    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(payload.data.user).toMatchObject({ id: 'user-1', username: 'admin' });
  });

  it('destroys the session on logout', async () => {
    const mockSession = {
      user: { id: 'user-1' },
    };

    (getSession as unknown as Mock).mockResolvedValue(mockSession);

    const response = await logoutHandler(createRequest('/api/v1/auth/logout', 'POST'));

    expect(destroySession as unknown as Mock).toHaveBeenCalledWith(mockSession);

    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(payload.data).toEqual({ success: true });
  });
});
