import { z } from 'zod';

import type { ProjectAccess, ProjectStatus, ProjectVisibility } from '@/types/portfolio';

const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens');

const yearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Value must be in YYYY-MM format');

const optionalUrlSchema = z
  .string()
  .trim()
  .url('Invalid URL format')
  .optional();

const sectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Section title is required'),
  body: z.string().default('').optional(),
  order: z.number().int().min(0).default(0).optional(),
});

const galleryItemSchema = z.object({
  id: z.string().optional(),
  image: z.string().min(1, 'Image URL is required'),
  alt: z.string().optional(),
  title: z.string().optional(),
});

const visibilityOptions: readonly ProjectVisibility[] = ['public', 'private', 'internal'];
const accessOptions: readonly ProjectAccess[] = ['open-source', 'proprietary', 'client-owned'];
const statusOptions: readonly ProjectStatus[] = ['planning', 'in-progress', 'live', 'archived'];

const baseProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: slugSchema.optional(),
  tagline: z.string().min(1, 'Tagline is required'),
  intro: z.string().min(1, 'Intro is required'),
  summary: z.string().min(1, 'Summary is required'),
  featured: z.boolean().optional(),
  visibility: z.enum(visibilityOptions as [ProjectVisibility, ...ProjectVisibility[]]),
  access: z.enum(accessOptions as [ProjectAccess, ...ProjectAccess[]]),
  status: z.enum(statusOptions as [ProjectStatus, ...ProjectStatus[]]),
  domain: z.string().trim().optional(),
  company: z.string().trim().optional(),
  client: z.string().trim().optional(),
  website: optionalUrlSchema,
  repository: optionalUrlSchema,
  role: z.string().min(1, 'Role is required'),
  start: yearMonthSchema,
  end: yearMonthSchema.optional(),
  stack: z.array(z.string().min(1)).default([]),
  features: z.array(z.string().min(1)).optional(),
  sections: z.array(sectionSchema).optional(),
  gallery: z.array(galleryItemSchema).optional(),
  confidentialNotes: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().optional(),
});

export const createProjectSchema = baseProjectSchema;

export const updateProjectSchema = baseProjectSchema
  .partial()
  .extend({
    slug: slugSchema.optional(),
    title: z.string().min(1).optional(),
    intro: z.string().min(1).optional(),
    summary: z.string().min(1).optional(),
    tagline: z.string().min(1).optional(),
    role: z.string().min(1).optional(),
    website: optionalUrlSchema.or(z.literal('').optional()),
    repository: optionalUrlSchema.or(z.literal('').optional()),
    domain: z.string().trim().optional().or(z.literal('').optional()),
    company: z.string().trim().optional().or(z.literal('').optional()),
    client: z.string().trim().optional().or(z.literal('').optional()),
    confidentialNotes: z.string().optional().or(z.literal('').optional()),
    publishedAt: z.string().optional().or(z.literal('').optional()),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
