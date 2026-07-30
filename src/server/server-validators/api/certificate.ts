import { z } from 'zod';

const optionalUrlSchema = z.string().trim().url('Invalid URL format').optional();

const issuedOnSchema = z
  .string()
  .min(1, 'Issued date is required')
  .refine(
    (value) => !Number.isNaN(new Date(value).getTime()),
    'Issued date must be a valid ISO date',
  );

const baseCertificateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issuedOn: issuedOnSchema,
  credentialId: z.string().optional(),
  description: z.string().optional(),
  skills: z.array(z.string().min(1)).optional(),
  image: optionalUrlSchema,
  verifyUrl: optionalUrlSchema,
  displayOrder: z.number().int().min(0).optional(),
});

export const createCertificateSchema = baseCertificateSchema;

export const updateCertificateSchema = baseCertificateSchema
  .partial()
  .extend({
    name: z.string().min(1).optional(),
    issuer: z.string().min(1).optional(),
    credentialId: z.string().optional().or(z.literal('').optional()),
    description: z.string().optional().or(z.literal('').optional()),
    image: optionalUrlSchema.or(z.literal('').optional()),
    verifyUrl: optionalUrlSchema.or(z.literal('').optional()),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export type CreateCertificateInput = z.infer<typeof createCertificateSchema>;
export type UpdateCertificateInput = z.infer<typeof updateCertificateSchema>;
