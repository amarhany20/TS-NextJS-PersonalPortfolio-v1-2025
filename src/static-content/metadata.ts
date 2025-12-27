import type { Metadata } from '@/types/metadata'

// Generic, repo-safe default content.
// This is the baseline website content for everyone.
export const metadata: Metadata = {
  fullName: 'Your Name',
  tagline: 'Software Engineer · Full-Stack Developer',
  description: 'A modern portfolio template built with Next.js, TypeScript, Prisma, and Tailwind.',
  titleTemplate: '%s | Your Name',
  siteUrl: 'http://localhost:3000',
  openGraphImage: '/attachments/og-placeholder.png',
  twitterHandle: '@yourhandle',
  keywords: ['portfolio', 'software engineer', 'full-stack', 'next.js', 'typescript'],
  emails: ['you@example.com'],
  phones: [{ label: 'Primary', e164: '+10000000000' }],
  links: [
    { label: 'Website', href: 'http://localhost:3000' },
    { label: 'GitHub', href: 'https://github.com/yourname' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yourname' },
  ],
  bases: [{ city: 'Your City', countryCode: 'US' }],
  languages: ['English'],
  highlights: [
    'Built with Next.js App Router and TypeScript',
    'Server layer: services → repositories → serializers',
    'Prisma-backed CMS with admin dashboard',
  ],
  hero: {
    greeting: "Hi, I'm Your Name",
    callToAction: "Let's build something great together.",
    primaryButton: { text: 'Get in Touch', href: '#contact' },
    secondaryButton: { text: 'View Portfolio', href: '/portfolio' },
  },
  contact: {
    title: 'Get In Touch',
  },
} as const
