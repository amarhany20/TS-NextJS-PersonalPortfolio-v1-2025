import { z } from 'zod';

import { optionalUrlOrPathSchema } from '@/server/server-validators/url';

const optionalUrlSchema = z.string().trim().url('Invalid URL format').optional();

const receivedOnSchema = z
  .string()
  .optional()
  .refine(
    (value) => !value || !Number.isNaN(new Date(value).getTime()),
    'Received date must be a valid ISO date',
  );

const baseRecommendationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  position: z.string().optional(),
  company: z.string().optional(),
  relationship: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  rating: z.number().int().min(1).max(5).optional(),
  linkedin: optionalUrlSchema,
  recommendationLetterUrl: optionalUrlOrPathSchema,
  photo: optionalUrlOrPathSchema,
  receivedOn: receivedOnSchema,
  displayOrder: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export const createRecommendationSchema = baseRecommendationSchema;

export const updateRecommendationSchema = baseRecommendationSchema
  .partial()
  .extend({
    position: z.string().optional().or(z.literal('').optional()),
    company: z.string().optional().or(z.literal('').optional()),
    relationship: z.string().optional().or(z.literal('').optional()),
    linkedin: optionalUrlSchema.or(z.literal('').optional()),
    recommendationLetterUrl: optionalUrlOrPathSchema.or(z.literal('').optional()),
    photo: optionalUrlOrPathSchema.or(z.literal('').optional()),
    receivedOn: receivedOnSchema,
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateRecommendationInput = z.infer<typeof createRecommendationSchema>;
export type UpdateRecommendationInput = z.infer<typeof updateRecommendationSchema>;
