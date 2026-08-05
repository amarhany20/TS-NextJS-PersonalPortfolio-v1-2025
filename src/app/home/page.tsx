/**
 * Home Page
 *
 * Main landing page composing all home sections.
 * Server component that renders portfolio content.
 *
 * Touchpoints:
 * - sections/home for all page sections
 */

import type { Metadata } from 'next';

import HomeSections from '@/sections/home';
import { buildPageMetadata } from '@/server/server-utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('/home');
}

export default function HomePage() {
  return <HomeSections />;
}
