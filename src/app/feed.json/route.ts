import { NextResponse } from 'next/server';

import { buildFeedPayload } from '@/server/feeds/builder';
import { serializeJsonFeed } from '@/server/feeds/json';
import { errorResponse } from '@/server/http/responses';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const payload = await buildFeedPayload();
    const body = serializeJsonFeed(payload);
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/feed+json; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
