export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  featuredImage?: string;
  readingTime: number;
  published: boolean;
}

export interface BlogMeta {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
  featuredImage?: string;
  readingTime: number;
}
