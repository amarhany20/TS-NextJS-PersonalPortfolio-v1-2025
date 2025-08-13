/**
 * Authentication API - Session Route
 * GET /api/auth/session - Get current session
 * DELETE /api/auth/session - Logout
 */

import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie (fix cookie name to match login)
    const token = request.cookies.get("session-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No session token found" }, { status: 401 });
    }

    // Verify session
    const session = await AuthService.verifySession(token);

    if (!session) {
      // Clear invalid cookie (fix cookie name)
      const response = NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
      response.cookies.delete("session-token");
      return response;
    }

    return NextResponse.json({
      success: true,
      user: session.user,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error("Session verification error:", error);

    // Clear potentially corrupt cookie (fix cookie name)
    const response = NextResponse.json({ error: "Session verification failed" }, { status: 500 });
    response.cookies.delete("session-token");
    return response;
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get token from cookie (fix cookie name)
    const token = request.cookies.get("session-token")?.value;

    if (token) {
      // Logout (expire session in database)
      await AuthService.logout(token);
    }

    // Clear cookie (fix cookie name)
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.delete("session-token");
    return response;
  } catch (error) {
    console.error("Logout error:", error);

    // Still clear cookie even if logout fails (fix cookie name)
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
    response.cookies.delete("session-token");
    return response;
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
