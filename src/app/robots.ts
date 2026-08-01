import type { MetadataRoute } from 'next';
import { SettingsService } from '@/server/services/SettingsService';

/**
 * Dynamic Robots.txt Handler
 *
 * Configures search engine crawler rules based on site settings and environment.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  try {
    const settings = await SettingsService.getSiteContent();
    const siteUrl =
      settings.seo?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin/', '/api/'],
        },
      ],
      sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
    };
  } catch {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    };
  }
}
