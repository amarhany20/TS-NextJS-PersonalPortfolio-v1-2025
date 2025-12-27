import type { Project } from '@/types/portfolio'

import demoSaas from './demo-saas.json'
import demoApi from './demo-api.json'

const raw: unknown[] = [demoSaas, demoApi]

function dateKey(p: { start: string; end?: string | null }) {
  return (p.end || p.start) + '-01'
}

const now = new Date().toISOString()

export const portfolio: Project[] = raw
  .map((r) => {
    const o = r as Record<string, unknown>
    return {
      slug: String(o.slug),
      title: String(o.title),
      tagline: String(o.tagline),
      intro: String(o.intro),
      summary: String(o.summary),
      featured: Boolean(o.featured),
      visibility: o.visibility as Project['visibility'],
      access: o.access as Project['access'],
      status: o.status as Project['status'],
      domain: o.domain ?? undefined,
      company: o.company ?? undefined,
      client: o.client ?? undefined,
      website: o.website ?? undefined,
      repository: o.repository === null || typeof o.repository === 'string' ? o.repository : null,
      role: String(o.role),
      start: String(o.start),
      end: o.end ?? undefined,
      stack: Array.isArray(o.stack) ? (o.stack as string[]) : [],
      features: Array.isArray(o.features) ? (o.features as string[]) : [],
      sections: Array.isArray(o.sections) ? (o.sections as Project['sections']) : [],
      gallery: Array.isArray(o.gallery) ? (o.gallery as Project['gallery']) : [],
      confidentialNotes: typeof o.confidentialNotes === 'string' ? o.confidentialNotes : undefined,
      createdAt: typeof o.createdAt === 'string' ? o.createdAt : now,
      updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : now,
    } as Project
  })
  .sort((a, b) => dateKey(b).localeCompare(dateKey(a)))

export const featuredProjects = portfolio.filter((p) => p.featured)
export const nonFeaturedProjects = portfolio.filter((p) => !p.featured)

export function findProject(slug: string) {
  return portfolio.find((p) => p.slug === slug) || null
}
