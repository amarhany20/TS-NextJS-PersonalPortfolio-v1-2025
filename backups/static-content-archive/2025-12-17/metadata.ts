import type { Metadata } from '@/types/metadata';

export const metadata: Metadata = {
  fullName: 'Ammar Hany Ezeldin Abdelrazik',
  // Short professional tagline (condensed)
  tagline: 'Software Engineer · Digital Solutions Architect',
  description: 'Staff engineer and solutions architect delivering production-grade platforms, admin experiences, and cloud-native automation.',
  titleTemplate: '%s | Ammar Hany',
  siteUrl: 'https://ammarhany.com',
  openGraphImage: '/2024%20Ammar%20Personal%20Photo.jpg',
  twitterHandle: '@ammarhany20',
  keywords: [
    'Ammar Hany',
    'Staff Engineer',
    'Solutions Architect',
    'Full-Stack Developer',
    'Next.js',
    'TypeScript',
    'Prisma',
    'Portfolio',
  ],
  emails: ['ammarhanyezeldin@gmail.com'],
  phones: [
    { label: 'Egypt', e164: '+201061888476' },
    { label: 'Turkey', e164: '+905395775990' },
    { label: 'Sweden', e164: '+46739793588' },
  ],
  links: [
    { label: 'Website', href: 'https://ammarhany.com' },
    { label: 'Portfolio', href: 'https://ammarhany.com/portfolio' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ammarhany' },
    { label: 'GitHub', href: 'https://github.com/amarhany20' },
    { label: 'YouTube', href: 'https://www.youtube.com/@TheChillTechgineer' },
  ],
  bases: [
    { city: 'New Cairo', countryCode: 'EG' },
    { city: 'Mersin', countryCode: 'TR' },
  ],
  // relocation: 'Married to a Swedish citizen • frequent long stays in Sweden • eligible to work in Egypt & Turkey • open to global remote/hybrid/onsite roles.',
  languages: [
    'English (C2)',
    'Arabic (Native)',
    'Turkish (B2)',
    'Swedish (A1)',
  ],
  // Condensed, CV-aligned bullet points used in hero summary list
  highlights: [
    '4+ years delivering production software across backend, full-stack, and product engineering roles',
    'Architected cloud-native systems on AWS, Azure, GCP, and DigitalOcean with measured cost optimization',
    'Designed Shopify headless commerce with Next.js Storefront/Admin API integrations and SEO-first delivery',
    'Implemented CI/CD pipelines with GitHub Actions, Docker, and multi-environment governance',
    'Specialized in Python (Django, DRF), C# (ASP.NET Core), TypeScript/Next.js, and Go (Gin)',
    'Led Jetson edge-to-cloud computer vision deployments with real-time monitoring and analytics',
    'Built data-rich pricing, ERP, and analytics platforms on PostgreSQL, Neon, Redis, and Firebase',
  ],
  // Hero content configuration
  hero: {
    greeting: 'Hi, I\'m Ammar 👋',
    callToAction: 'Let\'s build something amazing together.',
    primaryButton: { text: 'Get in Touch', href: '#contact' },
    secondaryButton: { text: 'Download CV', href: '/cv/Ammar%202025%20CV%20General%20Website%20V1.502.pdf' },
  },
  // Contact information
  contact: {
    title: 'Get In Touch',
  },
} as const;
