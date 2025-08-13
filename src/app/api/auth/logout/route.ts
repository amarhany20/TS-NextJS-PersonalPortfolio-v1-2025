/**
 * Logout API Route
 * Handles user logout and session termination
 */

import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get the session token from cookies or headers
    const token = request.cookies.get("session-token")?.value || request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "No session to logout" }, { status: 200 });
    }

    // Logout the user
    await AuthService.logout(token);

    // Create response and clear the session cookie
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete("session-token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
