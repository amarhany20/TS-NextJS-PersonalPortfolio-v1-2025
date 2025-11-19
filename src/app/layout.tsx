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
  const titleBase = content.profile?.fullName || 'Portfolio';
  const title = `${titleBase} | Portfolio`;
  const description =
    content.hero?.subtitle ||
    content.contact?.description ||
    content.hero?.highlights?.[0] ||
    'Personal portfolio website.';

  return {
    title,
    description,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteContent = await SettingsService.getSiteContent();

  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-full`}>
	<ClientLayout siteContent={siteContent}>{children}</ClientLayout>
      </body>
    </html>
  );
}
