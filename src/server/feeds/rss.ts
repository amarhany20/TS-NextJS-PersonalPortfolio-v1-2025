/**
 * RSS 2.0 serializer.
 *
 * Spec reference: https://www.rssboard.org/rss-specification
 *
 * Output is plain UTF-8 XML, no external dependencies, and
 * self-contained (entities are escaped manually). We render the
 * `<channel>` once and append one `<item>` per feed item.
 */

import type { FeedPayload, FeedItem } from './types';

const escapeXml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const rfc822 = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return new Date().toUTCString();
  }
  return date.toUTCString();
};

const cdata = (value: string): string => {
  // CDATA sections cannot contain the sequence ']]>'. Replace it with
  // a split closing + opener so the original text still survives.
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
};

const renderItem = (item: FeedItem): string => {
  const category = item.kind === 'blog' ? 'blog' : 'portfolio';
  return [
    '    <item>',
    `      <title>${escapeXml(item.title)}</title>`,
    `      <link>${escapeXml(item.url)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(item.url)}</guid>`,
    `      <pubDate>${rfc822(item.publishedAt)}</pubDate>`,
    `      <category>${escapeXml(category)}</category>`,
    item.author ? `      <dc:creator>${cdata(item.author)}</dc:creator>` : '',
    `      <description>${cdata(item.summary)}</description>`,
    '    </item>',
  ]
    .filter(Boolean)
    .join('\n');
};

export function serializeRss(payload: FeedPayload): string {
  const { channel, items } = payload;
  const lastBuildDate = items.length
    ? rfc822(
        items
          .map((item) => item.publishedAt)
          .sort()
          .reverse()[0],
      )
    : new Date().toUTCString();

  const itemXml = items.map(renderItem).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${escapeXml(channel.title)}</title>`,
    `    <link>${escapeXml(channel.homeUrl)}</link>`,
    `    <description>${escapeXml(channel.description)}</description>`,
    `    <language>${escapeXml(channel.language ?? 'en')}</language>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(`${channel.siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    '    <docs>https://www.rssboard.org/rss-specification</docs>',
    `    <generator>TS-NextJS-PersonalPortfolio-v1-2025</generator>`,
    itemXml,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
