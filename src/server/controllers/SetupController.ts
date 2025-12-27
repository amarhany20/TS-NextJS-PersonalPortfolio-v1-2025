/**
 * Setup Controller
 *
 * Handles setup-related HTTP requests and orchestrates business logic.
 * Follows the controller pattern: parse → validate → call service → serialize → return response.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, validationErrorResponse } from '@/server/http/responses';
import { hashPassword } from '@/server/security/password';
import { SetupService } from '@/server/services/SetupService';

// Input validation schemas
const setupSchema = z.object({
  database: z.object({
    type: z.enum(['sqlite', 'postgresql']),
    connectionString: z.string().optional(), // Only required for PostgreSQL
  }),
  admin: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    displayName: z.string().min(1, 'Display name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
  site: z.object({
    siteTitle: z.string().min(1, 'Site title is required'),
    siteSubtitle: z.string().optional(),
    theme: z.string().min(1, 'Theme is required'),
  }),
  content: z.object({
    includeSampleData: z.boolean(),
  }).optional().default({ includeSampleData: false }),
});

const testDatabaseSchema = z.object({
  type: z.enum(['sqlite', 'postgresql']),
  connectionString: z.string().optional(), // Only required for PostgreSQL
});

export class SetupController {
  /**
   * GET /api/setup/status
   * Check the current setup status.
   */
  static async getStatus() {
    try {
      const status = await SetupService.getSetupStatus();
      return successResponse(status);
    } catch (error) {
      return errorResponse(error);
    }
  }

  /**
   * POST /api/setup
   * Complete setup process for the portfolio application.
   */
  static async completeSetup(request: NextRequest) {
    try {
      // Check if setup is already complete
      const setupStatus = await SetupService.getSetupStatus();
      if (setupStatus.isSetupComplete) {
        return errorResponse(new Error('Setup has already been completed'));
      }

      // Parse and validate input
      const body = await request.json();
      const validationResult = setupSchema.safeParse(body);

      if (!validationResult.success) {
        return validationErrorResponse(
          'Invalid setup data',
          validationResult.error.format()
        );
      }

      const { database, admin, site, content = { includeSampleData: false } } = validationResult.data;

      // Call service to complete setup
      const passwordHash = await hashPassword(admin.password);

      await SetupService.initializeDatabase({
        databaseProvider: database.type,
        connectionString: database.connectionString,
        adminUser: {
          username: admin.username,
          email: admin.email,
          displayName: admin.displayName,
          passwordHash,
        },
        siteSettings: {
          siteTitle: site.siteTitle,
          siteSubtitle: site.siteSubtitle || null,
          themeId: site.theme,
        },
        includeSampleData: content.includeSampleData,
      });

      // Return success response
      return successResponse({
        message: 'Setup completed successfully',
        adminUrl: '/admin',
        loginCredentials: {
          username: admin.username,
          email: admin.email,
        },
      });
    } catch (error) {
      return errorResponse(error);
    }
  }

  /**
   * POST /api/setup/test-database
   * Test database connectivity and configuration.
   */
  static async testDatabase(request: NextRequest) {
    try {
      // Parse and validate input
      const body = await request.json();
      const validationResult = testDatabaseSchema.safeParse(body);

      if (!validationResult.success) {
        return validationErrorResponse(
          'Invalid database configuration',
          validationResult.error.format()
        );
      }

      const { type, connectionString } = validationResult.data;

      // Test database connection
      const testResult = await SetupService.testDatabaseConnection({
        type,
        connectionString,
      });

      if (!testResult.success) {
        return errorResponse(new Error(testResult.error || 'Database connection failed'));
      }

      return successResponse({
        message: 'Database connection successful',
        provider: testResult.provider,
      });
    } catch (error) {
      return errorResponse(error);
    }
  }
}