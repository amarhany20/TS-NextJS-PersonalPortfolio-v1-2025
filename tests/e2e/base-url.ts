export function getPlaywrightBaseUrl(): string {
  const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === '1' && !process.env.CI;
  const isolatedBaseUrl = process.env.PLAYWRIGHT_ISOLATED_BASE_URL ?? 'http://127.0.0.1:3100';

  return reuseExistingServer
    ? (process.env.PLAYWRIGHT_BASE_URL ?? isolatedBaseUrl)
    : isolatedBaseUrl;
}
