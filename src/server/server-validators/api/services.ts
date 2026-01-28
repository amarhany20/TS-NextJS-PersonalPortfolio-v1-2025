import { z } from 'zod';

export const updateServiceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  pricing: z.string().optional(),
  published: z.boolean().optional(),
  displayOrder: z.number().optional(),
});