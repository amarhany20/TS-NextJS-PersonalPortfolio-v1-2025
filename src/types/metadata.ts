// metadata.ts - site-wide structured metadata types

export interface Link { label: string; href: string }
export interface Phone { label: string; e164: string }
export interface BaseLocation { city: string; countryCode: string }

export interface SiteMetadata {
  fullName: string;
  tagline: string;
  emails: readonly string[];
  phones: readonly Phone[];
  links: readonly Link[];
  bases: readonly BaseLocation[];
  relocation: string;
  languages: readonly string[];
  highlights: readonly string[];
}

export type { SiteMetadata as Metadata };
