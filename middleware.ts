/**
 * Global middleware placeholder.
 *
 * The project currently does not apply request-level mutations here, but we keep the middleware
 * file in place so launch-phase hardening can add auth or maintenance gating without reworking the
 * app structure.
 */

import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}
