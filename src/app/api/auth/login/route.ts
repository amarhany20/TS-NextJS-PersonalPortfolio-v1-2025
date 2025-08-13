/**
 * Authentication API - Login Route
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from "next/server";
import { AuthService, loginRateLimiter } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0] || realIp || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || undefined;

    // Apply rate limiting
    try {
      await loginRateLimiter.consume(`${ipAddress}_login`);
    } catch (rateLimiterResult: unknown) {
      const result = rateLimiterResult as { msBeforeNext?: number };
      return NextResponse.json(
        {
          error: "Too many login attempts",
          message: `Try again in ${Math.round((result?.msBeforeNext || 900000) / 1000)} seconds`,
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    console.log("🔍 Login attempt:", { email, hasPassword: !!password });

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Authenticate user
    console.log("🔐 Attempting authentication...");
    const { user, session } = await AuthService.login({ email, password }, ipAddress, userAgent);
    console.log("✅ Authentication successful:", user.email);

    // Set HTTP-only cookie for the session token
    const response = NextResponse.json({
      success: true,
      user,
      message: "Login successful",
    });

    response.cookies.set("session-token", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
