import { NextResponse } from 'next/server';

import { buildFeedPayload } from '@/server/feeds/builder';
import { serializeRss } from '@/server/feeds/rss';
import { errorResponse } from '@/server/http/responses';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const payload = await buildFeedPayload();
    const body = serializeRss(payload);
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
