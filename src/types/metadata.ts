// metadata.ts - site-wide structured metadata types

export interface Link { label: string; href: string }
export interface Phone { label: string; e164: string }
export interface BaseLocation { city: string; countryCode: string }

export interface HeroConfig {
  greeting: string;
  callToAction: string;
  primaryButton: { text: string; href: string };
  secondaryButton: { text: string; href: string };
}

export interface ContactConfig {
  title: string;
}

export interface SiteMetadata {
  fullName: string;
  tagline: string;
  description: string;
  keywords: readonly string[];
  emails: readonly string[];
  phones: readonly Phone[];
  links: readonly Link[];
  bases: readonly BaseLocation[];
  siteUrl?: string;
  titleTemplate?: string;
  openGraphImage?: string;
  twitterHandle?: string;
  // relocation: string;
  highlights: readonly string[];
  hero: HeroConfig;
  contact: ContactConfig;
  languages: readonly string[];
}

export type { SiteMetadata as Metadata };
