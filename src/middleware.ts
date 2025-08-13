import { NextRequest, NextResponse } from "next/server";

// Enhanced middleware for performance and security
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // Performance Headers
  response.headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");

  // Compression
  if (request.headers.get("accept-encoding")?.includes("gzip")) {
    response.headers.set("Content-Encoding", "gzip");
  }

  // Analytics Tracking (Basic)
  const userAgent = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";
  const url = request.nextUrl.pathname;

  // Log page view (in production, send to analytics service)
  if (process.env.NODE_ENV === "production") {
    console.log(`Page View: ${url} | User-Agent: ${userAgent.substring(0, 50)} | Referer: ${referer}`);
  }

  return response;
}

// Configure middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
