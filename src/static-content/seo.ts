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
    default: 'Portfolio',
    template: '%s | Portfolio',
  },
  description: 'A modern portfolio template built with Next.js and TypeScript.',
  keywords: ['portfolio', 'web development', 'full-stack', 'Next.js', 'TypeScript', 'React'],
  authors: [{ name: 'Portfolio Owner' }],
  creator: 'Portfolio Owner',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Portfolio',
    title: 'Portfolio',
    description: 'A modern portfolio template built with Next.js and TypeScript.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio',
    description: 'A modern portfolio template built with Next.js and TypeScript.',
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
  name: 'Portfolio',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'A modern portfolio template built with Next.js and TypeScript.',
  links: {
    twitter: '',
    github: '',
    linkedin: '',
  },
} as const;
