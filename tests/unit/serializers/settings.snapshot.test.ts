import { describe, expect, it } from 'vitest';

import { metadata } from '@/static-content/metadata';
import { contactInfo, heroContent, personalInfo } from '@/static-content/personal';
import { coreSkills } from '@/static-content/skills';
import type { DbSettings } from '@/server/repositories/SettingsRepository';
import { serializeSettings } from '@/server/serializers/settings';

describe('serializeSettings snapshots', () => {
  const seededRecord: DbSettings = {
    id: 'settings-singleton',
    siteTitle: metadata.fullName,
    siteSubtitle: metadata.tagline,
    heroGreeting: heroContent.greeting,
    heroSubtitle: heroContent.subtitle,
    heroDescription: heroContent.description,
    primaryEmail: metadata.emails[0] ?? null,
    secondaryEmail: metadata.emails[1] ?? null,
    location: personalInfo.location,
    timezone: 'UTC',
    theme: 'professional-dark',
    maintenanceMode: false,
    maintenanceMessage: null,
    socialLinks: Array.from(metadata.links) as unknown as Array<Record<string, unknown>>,
    heroButtons: {
      primary: metadata.hero.primaryButton,
      secondary: metadata.hero.secondaryButton,
    },
    contactConfig: {
      title: contactInfo.title,
      subtitle: metadata.tagline,
      description: metadata.hero.callToAction,
      phones: metadata.phones,
    },
    seoDefaults: {
      languages: metadata.languages,
      highlights: metadata.highlights,
      coreSkills: coreSkills.map((skill) => skill.name),
      title: metadata.fullName,
      titleTemplate: metadata.titleTemplate,
      description: metadata.description,
      keywords: metadata.keywords,
      siteUrl: metadata.siteUrl,
      openGraphImage: metadata.openGraphImage,
      twitterHandle: metadata.twitterHandle,
    },
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-02T00:00:00Z'),
  };

  it('matches seeded settings snapshot', () => {
    const content = serializeSettings(seededRecord);
    expect(content).toMatchSnapshot();
  });

  it('matches minimal settings snapshot', () => {
    const minimalRecord: DbSettings = {
      id: 'settings-singleton',
      siteTitle: 'Untitled Profile',
      siteSubtitle: null,
      heroGreeting: null,
      heroSubtitle: null,
      heroDescription: null,
      primaryEmail: null,
      secondaryEmail: null,
      location: null,
      timezone: null,
      theme: 'missing-theme',
      maintenanceMode: false,
      maintenanceMessage: null,
      socialLinks: [],
      heroButtons: null,
      contactConfig: null,
      seoDefaults: {},
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date('2025-01-01T00:00:00Z'),
    };

    const content = serializeSettings(minimalRecord);
    expect(content).toMatchSnapshot();
  });
});
