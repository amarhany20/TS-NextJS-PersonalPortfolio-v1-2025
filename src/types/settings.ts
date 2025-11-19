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

export interface SiteContent {
  hero: HeroContent;
  contact: ContactDetails;
  profile: ProfileInfo;
  languages: string[];
  coreSkills: string[];
  highlights: string[];
  socialLinks: LinkItem[];
}
