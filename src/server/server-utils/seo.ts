import type { Metadata } from 'next';

import { SettingsService } from '@/server/services/SettingsService';

/**
 * Builds page-specific metadata (title, description, canonical, Open Graph)
 * for a public page. Pass the page's public path (e.g. '/portfolio', '/services')
 * so the canonical and og:url point at the real page instead of the root.
 */
export async function buildPageMetadata(path: string, titleOverride?: string): Promise<Metadata> {
  try {
    const content = await SettingsService.getSiteContent();
    const displayName = content.profile?.fullName ?? 'Portfolio';
    const siteUrl = (content.seo?.siteUrl ?? '').replace(/\/+$/, '');
    const pageUrl = siteUrl ? `${siteUrl}${path}` : undefined;

    const baseTitle =
      titleOverride ??
      (content.seo?.title
        ? `${titleOverride ?? path.replace(/^\//, '')} | ${displayName}`
        : displayName);

    return {
      title: baseTitle,
      description:
        content.seo?.description || content.hero?.subtitle || 'Personal portfolio website.',
      alternates: pageUrl ? { canonical: pageUrl } : undefined,
      openGraph: pageUrl
        ? {
            type: 'website',
            url: pageUrl,
            title: baseTitle,
            description: content.seo?.description || content.hero?.subtitle || undefined,
            siteName: displayName,
          }
        : undefined,
    };
  } catch {
    return { title: titleOverride ?? 'Portfolio' };
  }
}
