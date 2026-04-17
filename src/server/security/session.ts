import { getIronSession, type IronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

import { UnauthorizedError } from '@/server/http/errors';
import { env } from '@/server/server-validators/env';

export interface SessionUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: string;
}

export interface AppSession {
  user?: SessionUser;
  lastActiveAt?: number;
}

const COOKIE_NAME = 'portfolio_session';
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

let cachedOptions: SessionOptions | null = null;

function resolveSessionOptions(): SessionOptions {
  if (cachedOptions) {
    return cachedOptions;
  }

  const secret = env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET environment variable must be set to a 32+ character string.');
  }

  cachedOptions = {
    cookieName: COOKIE_NAME,
    password: secret,
    ttl: DEFAULT_TTL_SECONDS,
    cookieOptions: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
  } satisfies SessionOptions;

  return cachedOptions;
}

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export async function getSession(store?: CookieStore): Promise<IronSession<AppSession>> {
  const cookieStore = store ?? (await cookies());
  return getIronSession<AppSession>(cookieStore, resolveSessionOptions());
}

export async function requireAuth(store?: CookieStore): Promise<IronSession<AppSession>> {
  const session = await getSession(store);

  if (!session.user) {
    throw new UnauthorizedError('Authentication required');
  }

  return session;
}

export async function destroySession(session: IronSession<AppSession>): Promise<void> {
  await session.destroy();
}
