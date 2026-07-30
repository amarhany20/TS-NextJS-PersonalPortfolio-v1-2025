import { describe, expect, it } from 'vitest';

import type { FeedPayload } from '@/server/feeds/types';
import { serializeRss } from '@/server/feeds/rss';
import { serializeJsonFeed } from '@/server/feeds/json';

const basePayload: FeedPayload = {
  channel: {
    title: 'Ammar Hany — Portfolio',
    description: 'Published portfolio projects and blog posts.',
    siteUrl: 'https://ammarhany.com',
    homeUrl: 'https://ammarhany.com',
    author: 'Ammar Hany',
    language: 'en',
  },
  items: [
    {
      id: 'project-a',
      kind: 'portfolio',
      title: 'Project A',
      summary: 'A short summary of Project A.',
      url: 'https://ammarhany.com/portfolio/project-a',
      publishedAt: '2026-04-15T10:00:00.000Z',
    },
    {
      id: 'hello-world',
      kind: 'blog',
      title: 'Hello, world',
      summary: 'My first post.',
      url: 'https://ammarhany.com/blogs/hello-world',
      publishedAt: '2026-05-01T08:00:00.000Z',
      author: 'Ammar Hany',
    },
  ],
};

describe('serializeRss', () => {
  it('emits a valid RSS 2.0 envelope', () => {
    const xml = serializeRss(basePayload);

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<channel>');
    expect(xml).toContain('</channel>');
    expect(xml).toContain('</rss>');
  });

  it('renders channel metadata', () => {
    const xml = serializeRss(basePayload);

    expect(xml).toContain('<title>Ammar Hany — Portfolio</title>');
    expect(xml).toContain('<link>https://ammarhany.com</link>');
    expect(xml).toContain('<language>en</language>');
    expect(xml).toContain('<atom:link href="https://ammarhany.com/feed.xml" rel="self"');
  });

  it('renders one <item> per feed entry with category and guid', () => {
    const xml = serializeRss(basePayload);

    expect((xml.match(/<item>/g) ?? []).length).toBe(2);
    expect(xml).toContain('<category>portfolio</category>');
    expect(xml).toContain('<category>blog</category>');
    expect(xml).toContain(
      '<guid isPermaLink="true">https://ammarhany.com/portfolio/project-a</guid>',
    );
  });

  it('formats pubDate as RFC-822', () => {
    const xml = serializeRss(basePayload);
    expect(xml).toMatch(
      /<pubDate>[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/,
    );
  });

  it('escapes XML special characters in titles and summaries', () => {
    const xml = serializeRss({
      ...basePayload,
      items: [
        {
          ...basePayload.items[0],
          title: '5 < 10 & "right"',
          summary: 'A & B < C',
        },
      ],
    });

    expect(xml).toContain('5 &lt; 10 &amp; &quot;right&quot;');
    expect(xml).toContain('<description><![CDATA[A & B < C]]></description>');
  });

  it('handles CDATA sequences in the summary', () => {
    const xml = serializeRss({
      ...basePayload,
      items: [
        {
          ...basePayload.items[0],
          summary: 'closing ]]> mid-text',
        },
      ],
    });

    expect(xml).toContain(']]]]><![CDATA[>');
    expect(xml).toContain(
      '<description><![CDATA[closing ]]]]><![CDATA[> mid-text]]></description>',
    );
  });

  it('handles an empty item list with no crash', () => {
    const xml = serializeRss({ ...basePayload, items: [] });
    expect(xml).toContain('<channel>');
    expect((xml.match(/<item>/g) ?? []).length).toBe(0);
  });
});

describe('serializeJsonFeed', () => {
  it('emits a valid JSON Feed v1.1 envelope', () => {
    const json = serializeJsonFeed(basePayload);
    const parsed = JSON.parse(json) as Record<string, unknown>;

    expect(parsed.version).toBe('https://jsonfeed.org/version/1.1');
    expect(parsed.title).toBe('Ammar Hany — Portfolio');
    expect(parsed.home_page_url).toBe('https://ammarhany.com');
    expect(parsed.feed_url).toBe('https://ammarhany.com/feed.json');
    expect(parsed.language).toBe('en');
    expect(Array.isArray(parsed.items)).toBe(true);
  });

  it('formats dates as RFC 3339 / ISO-8601', () => {
    const json = serializeJsonFeed(basePayload);
    const parsed = JSON.parse(json) as { items: Array<{ date_published: string }> };

    expect(parsed.items[0].date_published).toBe('2026-04-15T10:00:00.000Z');
    expect(parsed.items[1].date_published).toBe('2026-05-01T08:00:00.000Z');
  });

  it('tags every item with its kind', () => {
    const json = serializeJsonFeed(basePayload);
    const parsed = JSON.parse(json) as { items: Array<{ tags: string[] }> };

    expect(parsed.items.map((item) => item.tags)).toEqual([['portfolio'], ['blog']]);
  });

  it('uses the channel author when an item does not set one', () => {
    const json = serializeJsonFeed(basePayload);
    const parsed = JSON.parse(json) as { items: Array<{ author: { name: string } }> };

    expect(parsed.items[0].author.name).toBe('Ammar Hany');
    expect(parsed.items[1].author.name).toBe('Ammar Hany');
  });

  it('renders authors array at the channel level', () => {
    const json = serializeJsonFeed(basePayload);
    const parsed = JSON.parse(json) as { authors: Array<{ name: string; url: string }> };

    expect(parsed.authors).toEqual([{ name: 'Ammar Hany', url: 'https://ammarhany.com' }]);
  });

  it('omits authors when both channel and items have no name', () => {
    const json = serializeJsonFeed({
      ...basePayload,
      channel: { ...basePayload.channel, author: '' },
      items: [{ ...basePayload.items[0] }],
    });
    const parsed = JSON.parse(json) as { authors?: unknown };

    expect(parsed.authors).toBeUndefined();
  });

  it('emits stable JSON for an empty feed', () => {
    const json = serializeJsonFeed({ ...basePayload, items: [] });
    const parsed = JSON.parse(json) as { items: unknown[] };

    expect(parsed.items).toEqual([]);
  });
});
