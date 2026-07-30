import { z } from 'zod';

export const updateSkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  proficiency: z.number().min(0).max(100),
  description: z.string().optional(),
  icon: z.string().optional(),
  published: z.boolean().optional(),
  displayOrder: z.number().optional(),
});
