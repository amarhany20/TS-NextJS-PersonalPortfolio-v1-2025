import { z } from 'zod';

export const updateRecommendationSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email().optional(),
  linkedinUrl: z.string().url().optional(),
  avatar: z.string().optional(),
  content: z.string().min(1),
  skills: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  displayOrder: z.number().optional(),
});