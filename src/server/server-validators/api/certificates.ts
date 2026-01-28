import { z } from 'zod';

export const updateCertificateSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional(),
  skills: z.array(z.string()).optional(),
  description: z.string().optional(),
  published: z.boolean().optional(),
  displayOrder: z.number().optional(),
});