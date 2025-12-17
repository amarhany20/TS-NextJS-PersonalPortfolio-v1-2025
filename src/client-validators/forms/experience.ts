import type { z } from 'zod';

import { createExperienceSchema, updateExperienceSchema } from '@/server/server-validators/api/experience';

export const experienceCreateSchema = createExperienceSchema;
export const experienceUpdateSchema = updateExperienceSchema;

export type ExperienceCreatePayload = z.infer<typeof experienceCreateSchema>;
export type ExperienceUpdatePayload = z.infer<typeof experienceUpdateSchema>;
