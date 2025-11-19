import { z } from 'zod';

const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens');

const baseServiceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: slugSchema.optional(),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional(),
  features: z.array(z.string().min(1)).optional(),
  technologies: z.array(z.string().min(1)).optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  active: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const createServiceSchema = baseServiceSchema.extend({
  id: z.string().optional(),
});

export const updateServiceSchema = baseServiceSchema
  .partial()
  .extend({
    id: z.string().optional(),
    slug: slugSchema.optional(),
    longDescription: z.string().optional().or(z.literal('').optional()),
    icon: z.string().optional().or(z.literal('').optional()),
    image: z.string().optional().or(z.literal('').optional()),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
