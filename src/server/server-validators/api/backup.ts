import { z } from 'zod';

/**
 * Zod Schema for Database Backup Snapshot Validation
 */
export const backupSummarySchema = z.object({
  totalRecords: z.number().int().nonnegative(),
  counts: z.record(z.string(), z.number().int().nonnegative()).optional(),
});

export const backupEnvelopeSchema = z.object({
  version: z.string().default('1.0.0'),
  exportedAt: z.string().datetime().or(z.string()),
  summary: backupSummarySchema.optional(),
  data: z.object({
    settings: z.array(z.record(z.string(), z.unknown())).default([]),
    users: z.array(z.record(z.string(), z.unknown())).default([]),
    portfolio: z.array(z.record(z.string(), z.unknown())).default([]),
    blogs: z.array(z.record(z.string(), z.unknown())).default([]),
    categories: z.array(z.record(z.string(), z.unknown())).default([]),
    tags: z.array(z.record(z.string(), z.unknown())).default([]),
    blogCategories: z.array(z.record(z.string(), z.unknown())).default([]),
    blogTags: z.array(z.record(z.string(), z.unknown())).default([]),
    contentVersions: z.array(z.record(z.string(), z.unknown())).default([]),
    experiences: z.array(z.record(z.string(), z.unknown())).default([]),
    educations: z.array(z.record(z.string(), z.unknown())).default([]),
    skillGroups: z.array(z.record(z.string(), z.unknown())).default([]),
    skills: z.array(z.record(z.string(), z.unknown())).default([]),
    services: z.array(z.record(z.string(), z.unknown())).default([]),
    certificates: z.array(z.record(z.string(), z.unknown())).default([]),
    recommendations: z.array(z.record(z.string(), z.unknown())).default([]),
    attachments: z.array(z.record(z.string(), z.unknown())).default([]),
    contactSubmissions: z.array(z.record(z.string(), z.unknown())).default([]),
  }),
});

export type BackupEnvelope = z.infer<typeof backupEnvelopeSchema>;
