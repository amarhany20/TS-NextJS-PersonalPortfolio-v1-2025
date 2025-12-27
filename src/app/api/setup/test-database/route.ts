/**
 * Database Test API Endpoint
 *
 * Route handler for database testing operations.
 * Delegates to SetupController for business logic.
 */

import { NextRequest } from 'next/server';
import { SetupController } from '@/server/controllers/SetupController';

/**
 * POST /api/setup/test-database
 *
 * Test database connectivity and configuration.
 */
export async function POST(request: NextRequest) {
  return SetupController.testDatabase(request);
}