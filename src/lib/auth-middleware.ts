/**
 * Authentication Middleware for API Routes
 * Protects API endpoints and provides user context
 */

import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthUser;
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(request: NextRequest, handler: (req: AuthenticatedRequest) => Promise<NextResponse>): Promise<NextResponse> {
  try {
    // Get token from cookie or Authorization header
    const cookieToken = request.cookies.get("auth-token")?.value;
    const bearerToken = request.headers.get("authorization")?.replace("Bearer ", "");
    const token = cookieToken || bearerToken;

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Verify session
    const session = await AuthService.verifySession(token);

    if (!session) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    // Add user to request object
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = session.user;

    // Call the original handler
    return handler(authenticatedRequest);
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}

/**
 * Middleware to require specific role
 */
export async function requireRole(request: NextRequest, requiredRole: string, handler: (req: AuthenticatedRequest) => Promise<NextResponse>): Promise<NextResponse> {
  return requireAuth(request, async (req) => {
    if (!req.user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Check role hierarchy
    const roleHierarchy: Record<string, number> = {
      GUEST: 0,
      USER: 1,
      ADMIN: 2,
      SUPER_ADMIN: 3,
    };

    if ((roleHierarchy[req.user.role] || 0) < (roleHierarchy[requiredRole] || 999)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    return handler(req);
  });
}

/**
 * Middleware to allow optional authentication
 * If authenticated, user will be added to request
 */
export async function optionalAuth(request: NextRequest, handler: (req: AuthenticatedRequest) => Promise<NextResponse>): Promise<NextResponse> {
  try {
    // Get token from cookie or Authorization header
    const cookieToken = request.cookies.get("auth-token")?.value;
    const bearerToken = request.headers.get("authorization")?.replace("Bearer ", "");
    const token = cookieToken || bearerToken;

    if (token) {
      // Verify session if token exists
      const session = await AuthService.verifySession(token);

      if (session) {
        const authenticatedRequest = request as AuthenticatedRequest;
        authenticatedRequest.user = session.user;
      }
    }

    // Call handler regardless of authentication status
    return handler(request as AuthenticatedRequest);
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    // Continue without authentication if there's an error
    return handler(request as AuthenticatedRequest);
  }
}

/**
 * Helper function to get user from request (for use in API handlers)
 */
export function getUser(request: AuthenticatedRequest): AuthUser | null {
  return request.user || null;
}

/**
 * Helper function to check if user has permission for resource
 */
export function canAccessResource(user: AuthUser | null, resourceOwnerId?: string): boolean {
  if (!user) return false;

  // Super admins can access everything
  if (user.role === "SUPER_ADMIN") return true;

  // Admins can access most things
  if (user.role === "ADMIN") return true;

  // Users can only access their own resources
  if (resourceOwnerId && user.id === resourceOwnerId) return true;

  return false;
}
