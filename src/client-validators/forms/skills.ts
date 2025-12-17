import type { z } from 'zod';

import {
  createSkillGroupSchema,
  updateSkillGroupSchema,
} from '@/server/server-validators/api/skill';

export const skillGroupCreateSchema = createSkillGroupSchema;
export const skillGroupUpdateSchema = updateSkillGroupSchema;

export type SkillGroupCreatePayload = z.infer<typeof skillGroupCreateSchema>;
export type SkillGroupUpdatePayload = z.infer<typeof skillGroupUpdateSchema>;
