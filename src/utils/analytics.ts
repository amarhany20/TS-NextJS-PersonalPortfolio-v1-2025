/**
 * Launch-scope analytics shim.
 *
 * The relaunch build intentionally ships without a production analytics provider.
 * These helpers keep the call sites stable, allow development-time inspection, and
 * give us one place to wire a provider later without spreading conditional logic
 * across the UI.
 */

import { logger } from '@/utils/logger';

type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

const isDevelopment = process.env.NODE_ENV === 'development';

function logAnalyticsDebug(label: string, payload: unknown) {
  if (!isDevelopment) {
    return;
  }

  logger.debug(`[Analytics] ${label}`, payload as Record<string, unknown>);
}

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string) {
  logAnalyticsDebug('Page view', { path, title });

  // No analytics provider is wired in for the current launch pass.
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent) {
  logAnalyticsDebug('Event', event);

  // No analytics provider is wired in for the current launch pass.
}

/**
 * Track blog post view
 */
export function trackBlogPostView(slug: string, title: string) {
  trackEvent({
    name: 'blog_post_view',
    properties: {
      slug,
      title,
    },
  });
}

/**
 * Track blog post list view
 */
export function trackBlogListView() {
  trackEvent({
    name: 'blog_list_view',
  });
}
