/**
 * Shared feed types and helpers.
 *
 * The portfolio template ships an RSS 2.0 feed at `/feed.xml` and a
 * JSON Feed v1.1 feed at `/feed.json`. Both endpoints expose the same
 * underlying item set (published portfolio items + published blog
 * posts) so subscribers see one consistent source.
 *
 * Keep the helpers in this module framework-agnostic so they can be
 * unit-tested without spinning up Next.js.
 */

export type FeedItemKind = 'portfolio' | 'blog';

export interface FeedItem {
  /** Stable id for the item (we use the slug). */
  id: string;
  /** Display title. */
  title: string;
  /** Short, plain-text summary; falls back to the description. */
  summary: string;
  /** Absolute URL to the public page for this item. */
  url: string;
  /** ISO-8601 string; the feed renderer formats per spec. */
  publishedAt: string;
  /** Optional author name; falls back to the channel author. */
  author?: string;
  /** Item kind — used to set the right RSS category / JSON Feed tag. */
  kind: FeedItemKind;
}

export interface FeedChannel {
  /** Site title. */
  title: string;
  /** One-line site description. */
  description: string;
  /** Absolute URL of the home page. */
  siteUrl: string;
  /** Absolute URL of the human-language home page for self-reference. */
  homeUrl: string;
  /** Default author name (used when an item does not specify one). */
  author: string;
  /** ISO-639-1 language code; defaults to `en`. */
  language?: string;
}

export interface FeedPayload {
  channel: FeedChannel;
  items: FeedItem[];
}
