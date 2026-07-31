import type { MetadataRoute } from 'next';
import { BlogService } from '@/server/services/BlogService';
import { PortfolioService } from '@/server/services/PortfolioService';
import { SettingsService } from '@/server/services/SettingsService';

/**
 * Dynamic Sitemap Handler
 *
 * Generates sitemap.xml for all active public pages, published portfolio projects, and published blog posts.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const settings = await SettingsService.getSiteContent();
    const baseUrl = (settings.seo?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

    const routes: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/home`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
    ];

    if (settings.visibility?.pages?.portfolio) {
      routes.push({
        url: `${baseUrl}/portfolio`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });

      const projects = await PortfolioService.getPublishedProjects();
      for (const project of projects) {
        routes.push({
          url: `${baseUrl}/portfolio/${project.slug}`,
          lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    }

    if (settings.visibility?.pages?.services) {
      routes.push({
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    if (settings.visibility?.pages?.blogs) {
      routes.push({
        url: `${baseUrl}/blogs`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });

      const blogs = await BlogService.listPublishedPosts();
      for (const blog of blogs) {
        routes.push({
          url: `${baseUrl}/blogs/${blog.slug}`,
          lastModified: blog.publishedAt ? new Date(blog.publishedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }

    return routes;
  } catch {
    return [
      {
        url: `${(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')}/home`,
        lastModified: new Date(),
      },
    ];
  }
}
