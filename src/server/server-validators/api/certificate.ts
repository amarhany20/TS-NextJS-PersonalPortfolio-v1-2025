import { z } from 'zod';

import { optionalUrlOrPathSchema } from '@/server/server-validators/url';

const issuedOnSchema = z
  .string()
  .min(1, 'Issued date is required')
  .refine(
    (value) => !Number.isNaN(new Date(value).getTime()),
    'Issued date must be a valid ISO date',
  );

const baseCertificateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  issuer: z.string().trim().min(1, 'Issuer is required'),
  issuedOn: issuedOnSchema,
  credentialId: z.string().optional(),
  description: z.string().optional(),
  skills: z.array(z.string().min(1)).optional(),
  image: optionalUrlOrPathSchema,
  verifyUrl: optionalUrlOrPathSchema,
  displayOrder: z.number().int().min(0).optional(),
});

// `id` is intentionally omitted from create: rows get server-generated ids.
export const createCertificateSchema = baseCertificateSchema;

export const updateCertificateSchema = baseCertificateSchema
  .partial()
  .extend({
    id: z.string().optional(),
    name: z.string().min(1).optional(),
    issuer: z.string().min(1).optional(),
    credentialId: z.string().optional().or(z.literal('').optional()),
    description: z.string().optional().or(z.literal('').optional()),
    image: optionalUrlOrPathSchema.or(z.literal('').optional()),
    verifyUrl: optionalUrlOrPathSchema.or(z.literal('').optional()),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateCertificateInput = z.infer<typeof createCertificateSchema>;
export type UpdateCertificateInput = z.infer<typeof updateCertificateSchema>;
