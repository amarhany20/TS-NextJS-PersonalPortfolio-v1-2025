import { z } from 'zod';

const nullableTrimmedString = (max: number) =>
  z.string().trim().max(max).transform((value) => (value.length > 0 ? value : null));

const nullableEmail = z
  .string()
  .trim()
  .max(160)
  .refine((value) => value.length === 0 || z.email().safeParse(value).success, 'Enter a valid email address')
  .transform((value) => (value.length > 0 ? value : null));

export const updateSiteProfileSchema = z.object({
  siteTitle: z.string().trim().min(1, 'Full name is required').max(120),
  siteSubtitle: nullableTrimmedString(160),
  heroGreeting: nullableTrimmedString(120),
  heroSubtitle: nullableTrimmedString(160),
  heroDescription: nullableTrimmedString(2000),
  primaryEmail: nullableEmail,
  secondaryEmail: nullableEmail,
  location: nullableTrimmedString(160),
  timezone: nullableTrimmedString(80),
});

export type UpdateSiteProfileInput = z.output<typeof updateSiteProfileSchema>;

const visibilityBoolean = z.boolean();

export const updateSiteVisibilitySchema = z.object({
  pages: z.object({
    portfolio: visibilityBoolean,
    services: visibilityBoolean,
    blogs: visibilityBoolean,
  }),
  sections: z.object({
    summary: visibilityBoolean,
    experience: visibilityBoolean,
    education: visibilityBoolean,
    certificates: visibilityBoolean,
    recommendations: visibilityBoolean,
    skills: visibilityBoolean,
    contact: visibilityBoolean,
  }),
});

export type UpdateSiteVisibilityInput = z.output<typeof updateSiteVisibilitySchema>;