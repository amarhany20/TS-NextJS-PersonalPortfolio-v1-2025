import { z } from 'zod';

const yearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Value must be in YYYY-MM format');

const optionalUrlSchema = z.string().trim().url('Invalid URL format').optional();

const baseExperienceSchema = z.object({
  company: z.string().trim().min(1, 'Company is required'),
  title: z.string().trim().min(1, 'Title is required'),
  location: z.string().optional(),
  start: yearMonthSchema,
  end: yearMonthSchema.optional(),
  present: z.boolean().optional(),
  impact: z.string().optional(),
  achievements: z.array(z.string().min(1)).default([]),
  skills: z.array(z.string().min(1)).default([]),
  companyUrl: optionalUrlSchema,
  displayOrder: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

// `id` is intentionally omitted from create: rows get server-generated ids.
export const createExperienceSchema = baseExperienceSchema;

export const updateExperienceSchema = baseExperienceSchema
  .partial()
  .extend({
    id: z.string().optional(),
    companyUrl: optionalUrlSchema.or(z.literal('').optional()),
    location: z.string().optional().or(z.literal('').optional()),
    impact: z.string().optional().or(z.literal('').optional()),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
