/**
 * Root Layout
 *
 * App-wide layout component that wraps all pages.
 * Configures fonts, metadata, and provides client-side navigation wrapper.
 */

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';
import { SettingsService } from '@/server/services/SettingsService';
import './globals.css';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const content = await SettingsService.getSiteContent();
  const displayName = content.profile?.fullName ?? 'Portfolio';
  const description =
    content.seo?.description ||
    content.hero?.subtitle ||
    content.contact?.description ||
    content.hero?.highlights?.[0] ||
    'Personal portfolio website.';

  const metadataBaseString = content.seo?.metadataBase || content.seo?.siteUrl;
  const metadataBase = metadataBaseString ? new URL(metadataBaseString) : undefined;
  const keywords = content.seo?.keywords?.length ? content.seo.keywords : content.hero?.highlights ?? [];
  const canonical = content.seo?.siteUrl;
  const titleShape = content.seo?.titleTemplate
    ? {
        default: content.seo.title,
        template: content.seo.titleTemplate,
      }
    : content.seo?.title ?? `${displayName} | Portfolio`;

  const openGraphImages = content.seo?.openGraphImage
    ? [{ url: content.seo.openGraphImage }]
    : undefined;

  return {
    metadataBase,
    title: titleShape,
    description,
    keywords,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: 'website',
      url: canonical,
      title: content.seo?.title ?? displayName,
      description,
      siteName: displayName,
      images: openGraphImages,
    },
    twitter: {
      card: openGraphImages ? 'summary_large_image' : 'summary',
      title: content.seo?.title ?? displayName,
      description,
      creator: content.seo?.twitterHandle,
    },
    authors: displayName ? [{ name: displayName, url: canonical }] : undefined,
    creator: displayName,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteContent = await SettingsService.getSiteContent();
  const activeTheme = siteContent.theme?.id ?? 'professional-dark';

  return (
    <html lang="en" data-theme={activeTheme} className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-full`}>
	<ClientLayout siteContent={siteContent}>{children}</ClientLayout>
      </body>
    </html>
  );
}
