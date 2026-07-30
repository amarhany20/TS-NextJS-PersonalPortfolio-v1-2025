import { describe, expect, it } from 'vitest';

import type { DbSettings } from '@/server/repositories/SettingsRepository';
import { serializeSettings } from '@/server/serializers/settings';

describe('serializeSettings', () => {
  it('builds site content with sanitized data', () => {
    const record: DbSettings = {
      id: 'settings-singleton',
      siteTitle: 'Ammar Hany',
      siteSubtitle: 'Staff Engineer',
      heroGreeting: null,
      heroSubtitle: 'Building resilient systems',
      heroDescription: '<p>Hello</p>',
      primaryEmail: 'ammar@example.com',
      secondaryEmail: null,
      location: 'Berlin',
      timezone: 'CET',
      theme: 'default',
      maintenanceMode: false,
      maintenanceMessage: null,
      socialLinks: [{ label: 'GitHub', href: 'https://github.com/amarhany20' }],
      heroButtons: {
        primary: { text: 'Hire me', href: '#contact' },
        secondary: { text: 'View CV', href: '/cv.pdf' },
      },
      contactConfig: {
        title: 'Work together',
        description: 'Say hi',
        phones: [{ label: 'Work', e164: '+49123456789' }],
        leads: { left: 'Email', right: 'LinkedIn' },
      },
      seoDefaults: {
        languages: ['English'],
        highlights: ['Impact'],
        coreSkills: ['TypeScript'],
        title: 'Ammar Hany | Portfolio',
        titleTemplate: '%s | Ammar Hany',
        description: 'Impact-driven engineer',
        keywords: ['Next.js'],
        siteUrl: 'https://ammarhany.com',
        openGraphImage: '/og.png',
        twitterHandle: '@ammarhany',
      },
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-02T00:00:00Z'),
    };

    const content = serializeSettings(record);

    expect(content.profile.fullName).toBe('Ammar Hany');
    expect(content.hero.greeting).toBe('Ammar Hany');
    expect(content.hero.primaryButton).toEqual({ text: 'Hire me', href: '#contact' });
    expect(content.contact.emails).toEqual(['ammar@example.com']);
    expect(content.contact.phones).toEqual([{ label: 'Work', e164: '+49123456789' }]);
    expect(content.coreSkills).toEqual(['TypeScript']);
    expect(content.languages).toEqual(['English']);
    expect(content.socialLinks).toEqual([
      { label: 'GitHub', href: 'https://github.com/amarhany20' },
    ]);
    expect(content.seo).toEqual({
      title: 'Ammar Hany | Portfolio',
      titleTemplate: '%s | Ammar Hany',
      description: 'Impact-driven engineer',
      keywords: ['Next.js'],
      metadataBase: 'https://ammarhany.com/',
      siteUrl: 'https://ammarhany.com/',
      openGraphImage: '/og.png',
      twitterHandle: '@ammarhany',
    });
  });

  it('omits malformed hero buttons', () => {
    const record: DbSettings = {
      id: 'settings-singleton',
      siteTitle: 'Ammar',
      siteSubtitle: null,
      heroGreeting: null,
      heroSubtitle: null,
      heroDescription: null,
      primaryEmail: null,
      secondaryEmail: null,
      location: null,
      timezone: null,
      theme: 'default',
      maintenanceMode: false,
      maintenanceMessage: null,
      socialLinks: [{ label: 'GitHub', href: 'https://github.com/amarhany20' }],
      heroButtons: {
        primary: { text: 123, href: '#contact' },
      },
      contactConfig: {},
      seoDefaults: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const content = serializeSettings(record);

    expect(content.hero.primaryButton).toBeUndefined();
    expect(content.seo.title).toBe('Ammar');
  });
});
