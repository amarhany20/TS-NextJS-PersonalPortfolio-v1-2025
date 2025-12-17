export type BlogStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface BlogCategorySummary {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface BlogTagSummary {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImage?: string;
  status: BlogStatus;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
  readingTime?: number;
  seo?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  categories: BlogCategorySummary[];
  tags: BlogTagSummary[];
}

export interface BlogMeta {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  publishedAt?: string;
  readingTime?: number;
  categories: BlogCategorySummary[];
  tags: BlogTagSummary[];
}
