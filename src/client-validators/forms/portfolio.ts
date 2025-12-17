import type { z } from 'zod';

import { createProjectSchema, updateProjectSchema } from '@/server/server-validators/api/portfolio';

export const projectCreateSchema = createProjectSchema;
export const projectUpdateSchema = updateProjectSchema;

export type ProjectCreatePayload = z.infer<typeof projectCreateSchema>;
export type ProjectUpdatePayload = z.infer<typeof projectUpdateSchema>;
