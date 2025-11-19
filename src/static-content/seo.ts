/**
 * SEO Configuration
 * 
 * Default SEO metadata and OpenGraph configuration.
 * Page-specific metadata can override these defaults using Next.js generateMetadata.
 */

import type { Metadata } from 'next';

export const DEFAULT_SEO: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Ammar Portfolio',
    template: '%s | Ammar Portfolio',
  },
  description: 'Professional portfolio showcasing full-stack development projects and expertise',
  keywords: ['portfolio', 'web development', 'full-stack', 'Next.js', 'TypeScript', 'React'],
  authors: [{ name: 'Ammar' }],
  creator: 'Ammar',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Ammar Portfolio',
    title: 'Ammar Portfolio',
    description: 'Professional portfolio showcasing full-stack development projects and expertise',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ammar Portfolio',
    description: 'Professional portfolio showcasing full-stack development projects and expertise',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const SITE_CONFIG = {
  name: 'Ammar Portfolio',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'Professional portfolio showcasing full-stack development projects and expertise',
  links: {
    twitter: '',
    github: '',
    linkedin: '',
  },
} as const;
