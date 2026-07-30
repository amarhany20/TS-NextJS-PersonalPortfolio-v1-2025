/**
 * JSON Feed v1.1 serializer.
 *
 * Spec reference: https://www.jsonfeed.org/version/1.1/
 *
 * Output is a single JSON object with `version`, `title`, `home_page_url`,
 * `feed_url`, and an `items` array. Dates are RFC 3339 strings
 * (`toISOString` is RFC 3339 compatible).
 */

import type { FeedItem, FeedPayload } from './types';

interface JsonFeedAuthor {
  name?: string;
  url?: string;
}

interface JsonFeedAttachment {
  url: string;
  mime_type: string;
}

interface JsonFeedItem {
  id: string;
  url: string;
  title: string;
  content_text: string;
  summary?: string;
  date_published: string;
  date_modified?: string;
  author?: JsonFeedAuthor;
  tags?: string[];
  image?: string;
  banner_image?: string;
  attachments?: JsonFeedAttachment[];
}

interface JsonFeed {
  version: 'https://jsonfeed.org/version/1.1';
  title: string;
  home_page_url: string;
  feed_url: string;
  description?: string;
  language?: string;
  authors?: JsonFeedAuthor[];
  items: JsonFeedItem[];
}

const buildAuthors = (defaultAuthor: string, homeUrl: string): JsonFeedAuthor[] => {
  if (!defaultAuthor) {
    return [];
  }
  return [{ name: defaultAuthor, url: homeUrl }];
};

const toJsonItem = (item: FeedItem, defaultAuthor: string): JsonFeedItem => {
  const tag = item.kind === 'blog' ? 'blog' : 'portfolio';
  const out: JsonFeedItem = {
    id: item.url,
    url: item.url,
    title: item.title,
    content_text: item.summary,
    date_published: new Date(item.publishedAt).toISOString(),
    tags: [tag],
  };

  if (item.author || defaultAuthor) {
    out.author = { name: item.author ?? defaultAuthor };
  }

  return out;
};

export function serializeJsonFeed(payload: FeedPayload): string {
  const { channel, items } = payload;
  const authors = buildAuthors(channel.author, channel.homeUrl);
  const feed: JsonFeed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: channel.title,
    home_page_url: channel.homeUrl,
    feed_url: `${channel.siteUrl}/feed.json`,
    description: channel.description,
    language: channel.language ?? 'en',
    items: items.map((item) => toJsonItem(item, channel.author)),
    ...(authors.length > 0 ? { authors } : {}),
  };

  return JSON.stringify(feed, null, 2) + '\n';
}
