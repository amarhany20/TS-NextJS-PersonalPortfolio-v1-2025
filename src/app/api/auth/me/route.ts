/**
 * Authentication API - Me Route
 * GET /api/auth/me - Get current user profile
 */

import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("session-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No session token found" }, { status: 401 });
    }

    // Verify session and get user
    const session = await AuthService.verifySession(token);

    if (!session) {
      // Clear invalid cookie
      const response = NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
      response.cookies.delete("session-token");
      return response;
    }

    return NextResponse.json({
      success: true,
      user: session.user,
    });
  } catch (error) {
    console.error("User profile error:", error);

    // Clear potentially corrupt cookie
    const response = NextResponse.json({ error: "Failed to get user profile" }, { status: 500 });
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

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
