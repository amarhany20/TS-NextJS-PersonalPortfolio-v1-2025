import type { DbSettings } from '@/server/repositories/SettingsRepository';
import type { ContactDetails, ContactPhone, ContactLeads, HeroButton, HeroContent, LinkItem, ProfileInfo, SiteContent } from '@/types/settings';

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

  return {
    hero,
    contact,
    profile,
    coreSkills,
    languages,
    highlights: hero.highlights,
    socialLinks,
  };
}
