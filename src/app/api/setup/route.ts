/**
 * Returns a retired-flow response for the removed setup API surface.
 */

import { NextResponse } from 'next/server';

const disabledResponse = () =>
  NextResponse.json(
    { error: 'Setup API has been removed. Configure .env and run migrations instead.' },
    { status: 404 }
  );

export async function GET() {
  return disabledResponse();
}

export async function POST() {
  return disabledResponse();
}
