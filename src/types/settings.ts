export interface LinkItem {
  label: string;
  href: string;
}

export interface ContactPhone {
  label: string;
  e164: string;
}

export interface HeroButton {
  text: string;
  href: string;
}

export interface HeroContent {
  greeting: string;
  subtitle?: string;
  descriptionHtml?: string;
  highlights: string[];
  primaryButton?: HeroButton;
  secondaryButton?: HeroButton;
}

export interface ContactLeads {
  left?: string;
  right?: string;
}

export interface ContactDetails {
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  emails: string[];
  phones: ContactPhone[];
  leads: ContactLeads;
  socialLinks: LinkItem[];
}

export interface ProfileInfo {
  fullName: string;
  title?: string;
  location?: string;
  photoUrl?: string;
}

export interface SeoConfig {
  title: string;
  titleTemplate?: string;
  description: string;
  keywords: string[];
  metadataBase?: string;
  siteUrl?: string;
  openGraphImage?: string;
  twitterHandle?: string;
}

export interface SiteTheme {
  id: string;
  name: string;
  description: string;
  accent: string;
  previewGradient: string;
  version: string;
  tags: string[];
}

export interface SitePageVisibility {
  portfolio: boolean;
  services: boolean;
  blogs: boolean;
}

export interface HomeSectionVisibility {
  summary: boolean;
  experience: boolean;
  education: boolean;
  certificates: boolean;
  recommendations: boolean;
  skills: boolean;
  contact: boolean;
}

export interface SiteVisibility {
  pages: SitePageVisibility;
  sections: HomeSectionVisibility;
}

export const DEFAULT_SITE_VISIBILITY: SiteVisibility = {
  pages: {
    portfolio: true,
    services: true,
    blogs: true,
  },
  sections: {
    summary: true,
    experience: true,
    education: true,
    certificates: true,
    recommendations: true,
    skills: true,
    contact: true,
  },
};

export interface SiteContent {
  hero: HeroContent;
  contact: ContactDetails;
  profile: ProfileInfo;
  languages: string[];
  coreSkills: string[];
  highlights: string[];
  socialLinks: LinkItem[];
  seo: SeoConfig;
  theme: SiteTheme;
  visibility: SiteVisibility;
}
