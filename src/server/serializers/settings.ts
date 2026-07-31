import { getThemeSummary } from '@/themes';
import type { DbSettings } from '@/server/repositories/SettingsRepository';
import { logger } from '@/utils/logger';
import {
  DEFAULT_SITE_VISIBILITY,
  type ContactDetails,
  type ContactPhone,
  type ContactLeads,
  type HeroButton,
  type HeroContent,
  type LinkItem,
  type ProfileInfo,
  type SeoConfig,
  type SiteContent,
  type SiteVisibility,
} from '@/types/settings';

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
  visibility?: unknown;
}

function toVisibilityConfig(value?: unknown): SiteVisibility {
  const pages =
    typeof value === 'object' && value && 'pages' in value
      ? (value as { pages?: Record<string, unknown> }).pages
      : undefined;
  const sections =
    typeof value === 'object' && value && 'sections' in value
      ? (value as { sections?: Record<string, unknown> }).sections
      : undefined;

  return {
    pages: {
      portfolio:
        typeof pages?.portfolio === 'boolean'
          ? pages.portfolio
          : DEFAULT_SITE_VISIBILITY.pages.portfolio,
      services:
        typeof pages?.services === 'boolean'
          ? pages.services
          : DEFAULT_SITE_VISIBILITY.pages.services,
      blogs: typeof pages?.blogs === 'boolean' ? pages.blogs : DEFAULT_SITE_VISIBILITY.pages.blogs,
    },
    sections: {
      summary:
        typeof sections?.summary === 'boolean'
          ? sections.summary
          : DEFAULT_SITE_VISIBILITY.sections.summary,
      experience:
        typeof sections?.experience === 'boolean'
          ? sections.experience
          : DEFAULT_SITE_VISIBILITY.sections.experience,
      education:
        typeof sections?.education === 'boolean'
          ? sections.education
          : DEFAULT_SITE_VISIBILITY.sections.education,
      certificates:
        typeof sections?.certificates === 'boolean'
          ? sections.certificates
          : DEFAULT_SITE_VISIBILITY.sections.certificates,
      recommendations:
        typeof sections?.recommendations === 'boolean'
          ? sections.recommendations
          : DEFAULT_SITE_VISIBILITY.sections.recommendations,
      skills:
        typeof sections?.skills === 'boolean'
          ? sections.skills
          : DEFAULT_SITE_VISIBILITY.sections.skills,
      contact:
        typeof sections?.contact === 'boolean'
          ? sections.contact
          : DEFAULT_SITE_VISIBILITY.sections.contact,
    },
  };
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
    logger.warn('[settings] Invalid URL in seoDefaults:', { url: stringValue, error });
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
    description:
      typeof contactConfig?.description === 'string' ? contactConfig.description : undefined,
    location: record.location ?? undefined,
    emails: [record.primaryEmail, record.secondaryEmail].filter(
      (email): email is string => typeof email === 'string' && email.length > 0,
    ),
    phones: toPhones(contactConfig?.phones),
    leads: {
      left: typeof contactConfig?.leads?.left === 'string' ? contactConfig?.leads?.left : undefined,
      right:
        typeof contactConfig?.leads?.right === 'string' ? contactConfig?.leads?.right : undefined,
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
  const visibility = toVisibilityConfig(seoDefaults?.visibility);

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
    visibility,
  };
}

function buildSeoConfig(record: DbSettings, seoDefaults?: SeoDefaultsShape | null): SeoConfig {
  const fallbackTitle = record.siteTitle;
  const fallbackDescription =
    record.heroDescription ??
    record.heroSubtitle ??
    record.siteSubtitle ??
    record.heroGreeting ??
    record.siteTitle;

  const keywords = toStringArray(seoDefaults?.keywords);

  const metadataBase =
    toAbsoluteUrl(seoDefaults?.metadataBase) ?? toAbsoluteUrl(seoDefaults?.siteUrl);
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
