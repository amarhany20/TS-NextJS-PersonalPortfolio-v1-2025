import { z } from 'zod';

const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens');

const skillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Skill name is required'),
  displayOrder: z.number().int().min(0).optional(),
});

const baseGroupSchema = z.object({
  slug: slugSchema.optional(),
  title: z.string().min(1, 'Title is required'),
  summary: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
  skills: z.array(skillItemSchema).optional(),
});

export const createSkillGroupSchema = baseGroupSchema;

export const updateSkillGroupSchema = baseGroupSchema
  .partial()
  .extend({
    slug: slugSchema.optional(),
    title: z.string().min(1).optional(),
    summary: z.string().optional().or(z.literal('').optional()),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateSkillGroupInput = z.infer<typeof createSkillGroupSchema>;
export type UpdateSkillGroupInput = z.infer<typeof updateSkillGroupSchema>;
export type SkillItemInput = z.infer<typeof skillItemSchema>;
