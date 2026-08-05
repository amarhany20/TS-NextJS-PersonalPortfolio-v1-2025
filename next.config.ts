import type { NextConfig } from 'next';
import fs from 'fs';
import path from 'path';

// Safely read package.json version once at config load
let appVersion = '0.0.0';
try {
  const pkgPath = path.join(__dirname, 'package.json');
  const pkgRaw = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgRaw);
  if (pkg.version) appVersion = String(pkg.version).trim();
} catch {
  console.warn('⚠️ Unable to read package version, defaulting to 0.0.0');
}

/**
 * Keep local dev and Playwright hostnames explicit so Next.js does not warn
 * when the app is exercised from 127.0.0.1 and localhost during relaunch
 * checks.
 */
const allowedDevOrigins = Array.from(
  new Set(
    [
      '127.0.0.1',
      'localhost',
      process.env.PLAYWRIGHT_BASE_URL,
      process.env.PLAYWRIGHT_ISOLATED_BASE_URL,
    ]
      .filter((value): value is string => Boolean(value))
      .map((value) => {
        try {
          return new URL(value).hostname;
        } catch {
          return value;
        }
      }),
  ),
);
const distDir = process.env.PLAYWRIGHT_ISOLATED === '1' ? '.next-playwright' : '.next';
const disableWebpackCache = process.env.PLAYWRIGHT_E2E_SERVER === '1';

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  distDir,
  poweredByHeader: false,
  allowedDevOrigins,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Attachments are stored as public Vercel Blob URLs; allow the optimizer to
    // fetch them (plus the local dev origin). External image hosts referenced in
    // content should be added here as needed.
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  turbopack: {
    root: __dirname,
  },
  webpack: (config) => {
    if (disableWebpackCache) {
      config.cache = false;
    }

    return config;
  },

  // Headers for security and performance.
  // NOTE: there is intentionally NO global Cache-Control rule for `/api/*`.
  // Every `/api` route is authenticated or request-scoped (public feeds live
  // outside `/api/`), so a blanket `Cache-Control: public` would let a CDN
  // serve one authenticated user's cached response to everyone. Authenticated
  // responses should stay uncached by default.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
