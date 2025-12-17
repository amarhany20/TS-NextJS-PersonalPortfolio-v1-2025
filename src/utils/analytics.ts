/**
 * Analytics utility for tracking page views and events.
 * 
 * This is a lightweight wrapper that can be extended to integrate with
 * analytics providers like Google Analytics, Plausible, or custom solutions.
 * 
 * For v1, this logs to console in development and can be extended with
 * actual analytics providers in production.
 */

type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Page view:', { path, title });
  }

  // TODO: Integrate with analytics provider (Google Analytics, Plausible, etc.)
  // Example:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('config', 'GA_MEASUREMENT_ID', { page_path: path, page_title: title });
  // }
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Event:', event);
  }

  // TODO: Integrate with analytics provider
  // Example:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', event.name, event.properties);
  // }
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

