import { z } from 'zod';

const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens');

const optionalUrl = z.string().url().optional();

const categorySchema = z.object({
  slug: slugSchema.optional(),
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
});

const tagSchema = z.object({
  slug: slugSchema.optional(),
  name: z.string().min(1, 'Tag name is required'),
  description: z.string().optional(),
});

const STATUS_VALUES = ['draft', 'scheduled', 'published', 'archived'] as const;

const baseBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: slugSchema.optional(),
  summary: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  coverImage: optionalUrl.or(z.literal('').optional()),
  status: z.enum(STATUS_VALUES).optional(),
  publishedAt: z.string().datetime().optional(),
  readingTime: z.number().int().positive().optional(),
  seo: z.record(z.string(), z.any()).optional(),
  meta: z.record(z.string(), z.any()).optional(),
  categories: z.array(categorySchema).optional(),
  tags: z.array(tagSchema).optional(),
});

export const createBlogSchema = baseBlogSchema;

export const updateBlogSchema = baseBlogSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

export type BlogCategoryInput = z.infer<typeof categorySchema>;
export type BlogTagInput = z.infer<typeof tagSchema>;
