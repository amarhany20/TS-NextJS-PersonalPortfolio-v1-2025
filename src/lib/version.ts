// App version is injected at build time via NEXT_PUBLIC_APP_VERSION (see next.config.ts)
// Fallback to 'dev' when not defined (e.g., during certain test contexts)
export const APP_VERSION: string =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_APP_VERSION
    ? String(process.env.NEXT_PUBLIC_APP_VERSION).trim()
    : 'dev';

export default APP_VERSION;
