import { getThemeSummary } from '@/themes';
import type { DbSettings } from '@/server/repositories/SettingsRepository';
import type { ContactDetails, ContactPhone, ContactLeads, HeroButton, HeroContent, LinkItem, ProfileInfo, SeoConfig, SiteContent } from '@/types/settings';

interface HeroButtonsShape {
  primary?: HeroButtonLike;
  secondary?: HeroButtonLike;
}

interface HeroButtonLike {
  text?: unknown;
  href?: unknown;
}

interface ContactConfigShape {
  title?: unknown;
  subtitle?: unknown;
  description?: unknown;
  leads?: Partial<ContactLeads>;
  phones?: Array<Partial<ContactPhone>>;
}

interface SeoDefaultsShape {
  languages?: unknown;
  highlights?: unknown;
  coreSkills?: unknown;
  title?: unknown;
  titleTemplate?: unknown;
  description?: unknown;
  keywords?: unknown;
  siteUrl?: unknown;
  metadataBase?: unknown;
  openGraphImage?: unknown;
  twitterHandle?: unknown;
}

const toButton = (value?: HeroButtonLike | null): HeroButton | undefined => {
  if (!value || typeof value.text !== 'string' || typeof value.href !== 'string') {
    return undefined;
  }

  return {
    text: value.text,
    href: value.href,
  };
};

const toLinkArray = (value?: Array<Record<string, unknown>> | null): LinkItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const label = typeof item.label === 'string' ? item.label : undefined;
      const href = typeof item.href === 'string' ? item.href : undefined;
      if (!label || !href) {
        return undefined;
      }
      return { label, href } satisfies LinkItem;
    })
    .filter((item): item is LinkItem => Boolean(item));
};

const toPhones = (value?: Array<Partial<ContactPhone>> | null): ContactPhone[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((phone) => {
      const label = typeof phone?.label === 'string' ? phone.label : undefined;
      const e164 = typeof phone?.e164 === 'string' ? phone.e164 : undefined;
      if (!label || !e164) {
        return undefined;
      }
      return { label, e164 } satisfies ContactPhone;
    })
    .filter((phone): phone is ContactPhone => Boolean(phone));
};

const toStringArray = (value?: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
};

const toNonEmptyString = (value?: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const toAbsoluteUrl = (value?: unknown): string | undefined => {
  const stringValue = toNonEmptyString(value);
  if (!stringValue) {
    return undefined;
  }

  try {
    return new URL(stringValue).toString();
  } catch (error) {
    console.warn('[settings] Invalid URL in seoDefaults:', stringValue, error);
    return undefined;
  }
};

const toPublicPath = (value?: unknown): string | undefined => {
  const stringValue = toNonEmptyString(value);
  if (!stringValue) {
    return undefined;
  }

  if (stringValue.startsWith('http')) {
    return toAbsoluteUrl(stringValue);
  }

  return stringValue.startsWith('/') ? stringValue : `/${stringValue}`;
};

export function serializeSettings(record: DbSettings): SiteContent {
  const buttons = (record.heroButtons as HeroButtonsShape | null) ?? undefined;
  const contactConfig = (record.contactConfig as ContactConfigShape | null) ?? undefined;
  const seoDefaults = (record.seoDefaults as SeoDefaultsShape | null) ?? undefined;

  const hero: HeroContent = {
    greeting: record.heroGreeting ?? record.siteTitle,
    subtitle: record.heroSubtitle ?? record.siteSubtitle ?? undefined,
    descriptionHtml: record.heroDescription ?? undefined,
    highlights: toStringArray(seoDefaults?.highlights),
    primaryButton: toButton(buttons?.primary),
    secondaryButton: toButton(buttons?.secondary),
  };

  const contact: ContactDetails = {
    title: typeof contactConfig?.title === 'string' ? contactConfig.title : 'Get In Touch',
    subtitle: typeof contactConfig?.subtitle === 'string' ? contactConfig.subtitle : hero.subtitle,
    description: typeof contactConfig?.description === 'string' ? contactConfig.description : undefined,
    location: record.location ?? undefined,
    emails: [record.primaryEmail, record.secondaryEmail].filter((email): email is string => typeof email === 'string' && email.length > 0),
    phones: toPhones(contactConfig?.phones),
    leads: {
      left: typeof contactConfig?.leads?.left === 'string' ? contactConfig?.leads?.left : undefined,
      right: typeof contactConfig?.leads?.right === 'string' ? contactConfig?.leads?.right : undefined,
    },
    socialLinks: toLinkArray(record.socialLinks),
  };

  const profile: ProfileInfo = {
    fullName: record.siteTitle,
    title: record.siteSubtitle ?? undefined,
    location: record.location ?? undefined,
  };

  const coreSkills = toStringArray(seoDefaults?.coreSkills);
  const languages = toStringArray(seoDefaults?.languages);
  const socialLinks = toLinkArray(record.socialLinks);

  const seo = buildSeoConfig(record, seoDefaults);

  return {
    hero,
    contact,
    profile,
    coreSkills,
    languages,
    highlights: hero.highlights,
    socialLinks,
    seo,
    theme: getThemeSummary(record.theme),
  };
}

function buildSeoConfig(record: DbSettings, seoDefaults?: SeoDefaultsShape | null): SeoConfig {
  const fallbackTitle = record.siteTitle;
  const fallbackDescription =
    record.heroDescription ?? record.heroSubtitle ?? record.siteSubtitle ?? record.heroGreeting ?? record.siteTitle;

  const keywords = toStringArray(seoDefaults?.keywords);

  const metadataBase = toAbsoluteUrl(seoDefaults?.metadataBase) ?? toAbsoluteUrl(seoDefaults?.siteUrl);
  const siteUrl = metadataBase ?? toAbsoluteUrl(seoDefaults?.siteUrl);

  return {
    title: toNonEmptyString(seoDefaults?.title) ?? fallbackTitle,
    titleTemplate: toNonEmptyString(seoDefaults?.titleTemplate) ?? undefined,
    description: toNonEmptyString(seoDefaults?.description) ?? fallbackDescription,
    keywords,
    metadataBase,
    siteUrl,
    openGraphImage: toPublicPath(seoDefaults?.openGraphImage),
    twitterHandle: toNonEmptyString(seoDefaults?.twitterHandle),
  } satisfies SeoConfig;
}
