import type { Metadata } from '@/types/metadata';

/**
 * Neutral fallback metadata for template/bootstrap scenarios.
 *
 * Launch-ready identity and SEO values should come from seeded settings or environment-backed
 * configuration instead of these repo-safe defaults.
 */
export const metadata: Metadata = {
  fullName: 'Portfolio Owner',
  tagline: 'Software Engineer',
  description: 'Portfolio website powered by Next.js, TypeScript, Prisma, and an admin CMS.',
  titleTemplate: '%s | Portfolio',
  siteUrl: 'http://localhost:3000',
  keywords: ['portfolio', 'software engineer', 'next.js', 'typescript'],
  emails: [],
  phones: [],
  links: [],
  bases: [],
  languages: ['English'],
  highlights: [
    'Next.js App Router portfolio platform',
    'Admin CMS with Prisma-backed persistence',
    'Typed services, repositories, and serializers',
  ],
  hero: {
    greeting: 'Welcome',
    callToAction: 'Explore the portfolio and get in touch.',
    primaryButton: { text: 'Contact', href: '#contact' },
    secondaryButton: { text: 'View Portfolio', href: '/portfolio' },
  },
  contact: {
    title: 'Get In Touch',
  },
} as const;
