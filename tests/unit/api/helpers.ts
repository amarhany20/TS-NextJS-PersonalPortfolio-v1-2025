import { NextRequest } from 'next/server';

type NextRequestInitCompat = Omit<RequestInit, 'signal'> & { signal?: AbortSignal };

export function createRequest(
  url: string,
  method: string,
  body?: unknown,
  headers?: Record<string, string>,
): NextRequest {
  const init: NextRequestInitCompat = {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  return new NextRequest(new URL(url, 'http://localhost'), init);
}
