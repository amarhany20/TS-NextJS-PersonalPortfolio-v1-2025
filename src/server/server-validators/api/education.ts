import { z } from 'zod';

const yearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Value must be in YYYY-MM format');

const baseEducationSchema = z.object({
  institution: z.string().trim().min(1, 'Institution is required'),
  degree: z.string().trim().min(1, 'Degree is required'),
  field: z.string().optional(),
  location: z.string().optional(),
  start: yearMonthSchema,
  end: yearMonthSchema.optional(),
  present: z.boolean().optional(),
  gpa: z.string().optional(),
  achievements: z.array(z.string().min(1)).default([]),
  project: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

// `id` is intentionally omitted from create: rows get server-generated ids.
export const createEducationSchema = baseEducationSchema;

export const updateEducationSchema = baseEducationSchema
  .partial()
  .extend({
    id: z.string().optional(),
    field: z.string().optional().or(z.literal('').optional()),
    location: z.string().optional().or(z.literal('').optional()),
    gpa: z.string().optional().or(z.literal('').optional()),
    project: z.string().optional().or(z.literal('').optional()),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
