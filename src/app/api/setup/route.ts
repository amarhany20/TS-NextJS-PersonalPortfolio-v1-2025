/**
 * Setup API Endpoint
 *
 * Route handler for setup operations.
 * Delegates to SetupController for business logic.
 */

import { NextRequest } from 'next/server';
import { SetupController } from '@/server/controllers/SetupController';

/**
 * GET /api/setup
 *
 * Check the current setup status.
 */
export async function GET() {
  return SetupController.getStatus();
}

/**
 * POST /api/setup
 *
 * Complete setup process for the portfolio application.
 */
export async function POST(request: NextRequest) {
  return SetupController.completeSetup(request);
}