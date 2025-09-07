import type { NextConfig } from "next";
import fs from 'fs';
import path from 'path';

// Safely read package.json version once at config load
let appVersion = '0.0.0';
try {
  const pkgPath = path.join(__dirname, 'package.json');
  const pkgRaw = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgRaw);
  if (pkg.version) appVersion = String(pkg.version).trim();
} catch (e) {
  console.warn('⚠️ Unable to read package version, defaulting to 0.0.0');
}

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
