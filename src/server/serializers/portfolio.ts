/**
 * Portfolio serializer
 *
 * Converts database records into the `Project` type consumed by the UI.
 */

import { randomUUID } from 'crypto';

import type { DbPortfolioProject } from '@/server/repositories/PortfolioRepository';
import type { Project, ProjectGalleryItem, ProjectSection } from '@/types/portfolio';
import { formatYearMonth } from './utils';

const normalizeSections = (sections: unknown[]): ProjectSection[] => {
  return sections
    .filter(
      (section): section is Record<string, unknown> => !!section && typeof section === 'object',
    )
    .map((section) => ({
      id: String(section.id ?? randomUUIDSafely()),
      title: typeof section.title === 'string' ? section.title : 'Untitled',
      body: typeof section.body === 'string' ? section.body : '',
      order: typeof section.order === 'number' ? section.order : 0,
    }))
    .sort((a, b) => a.order - b.order);
};

const normalizeGallery = (items: unknown[]): ProjectGalleryItem[] => {
  return items
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item, index) => ({
      id: String(item.id ?? randomUUIDSafely(index)),
      image: typeof item.image === 'string' ? item.image : '',
      alt: typeof item.alt === 'string' ? item.alt : undefined,
      title: typeof item.title === 'string' ? item.title : undefined,
    }))
    .filter((item) => Boolean(item.image));
};

const randomUUIDSafely = (seed?: number) => {
  try {
    return randomUUID();
  } catch {
    return `item-${seed ?? Math.random().toString(36).slice(2, 10)}`;
  }
};

export function serializeProject(record: DbPortfolioProject, includeInternal = false): Project {
  return {
    slug: record.slug,
    title: record.title,
    tagline: record.tagline,
    intro: record.intro,
    summary: record.summary,
    featured: record.featured,
    visibility: record.visibility as Project['visibility'],
    access: record.access as Project['access'],
    status: record.status as Project['status'],
    domain: record.domain ?? undefined,
    company: record.company ?? undefined,
    client: record.client ?? undefined,
    website: record.website ?? undefined,
    repository: record.repository ?? null,
    role: record.role,
    start: formatYearMonth(record.startDate) || formatYearMonth(record.createdAt),
    end: record.endDate ? formatYearMonth(record.endDate) : undefined,
    stack: Array.isArray(record.stack) ? record.stack : [],
    features: Array.isArray(record.features) ? record.features : undefined,
    sections: Array.isArray(record.sections) ? normalizeSections(record.sections) : undefined,
    gallery: Array.isArray(record.gallery) ? normalizeGallery(record.gallery) : undefined,
    contentMdx: record.contentMdx ?? undefined,
    // Internal-only field: only include it for admin callers so confidential
    // notes never leak into public listings, detail pages, sitemaps, or feeds.
    confidentialNotes: includeInternal ? (record.confidentialNotes ?? undefined) : undefined,
    displayOrder: record.displayOrder,
    published: record.published,
    publishedAt: record.publishedAt ? record.publishedAt.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
