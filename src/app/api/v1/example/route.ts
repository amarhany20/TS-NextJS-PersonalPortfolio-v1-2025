/**
 * Example API Route Handler
 * 
 * Demonstrates the standard pattern for API endpoints:
 * 1. Validate input with Zod
 * 2. Call service layer
 * 3. Serialize output
 * 4. Return consistent response
 * 
 * This is a reference implementation. Delete or modify as needed.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, validationErrorResponse } from '@/server/http/responses';

// Input validation schema
const querySchema = z.object({
  name: z.string().optional().default('World'),
});

/**
 * GET /api/v1/example
 * 
 * Example endpoint that returns a greeting.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Parse and validate input
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const validationResult = querySchema.safeParse(searchParams);

    if (!validationResult.success) {
      return validationErrorResponse(
        'Invalid query parameters',
        validationResult.error.format()
      );
    }

    const { name } = validationResult.data;

    // 2. Call service (in a real app, this would be in server/services/)
    const greeting = `Hello, ${name}!`;
    const timestamp = new Date().toISOString();

    // 3. Serialize response (in a real app, use server/serializers/)
    const data = {
      message: greeting,
      timestamp,
    };

    // 4. Return consistent response
    return successResponse(data);
  } catch (error) {
    // Centralized error handling
    return errorResponse(error);
  }
}

/**
 * POST /api/v1/example
 * 
 * Example endpoint that echoes back the request body.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate body
    const body = await request.json();
    
    const bodySchema = z.object({
      message: z.string().min(1, 'Message is required'),
    });

    const validationResult = bodySchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(
        'Invalid request body',
        validationResult.error.format()
      );
    }

    const { message } = validationResult.data;

    // 2. Process (service layer in real app)
    const echo = {
      received: message,
      length: message.length,
      timestamp: new Date().toISOString(),
    };

    // 3. Return response
    return successResponse(echo, undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
