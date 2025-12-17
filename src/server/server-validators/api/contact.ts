import { z } from 'zod';

import { CONTACT_SUBMISSION_STATUSES } from '@/types/contact';

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(120, 'Name is too long'),
  email: z.string().email('Valid email required').max(160, 'Email is too long'),
  phone: z.string().trim().max(50, 'Phone is too long').optional(),
  subject: z.string().trim().min(3, 'Subject is required').max(200, 'Subject too long').optional(),
  message: z.string().trim().min(10, 'Message is required').max(5000, 'Message too long'),
});

export const contactStatusSchema = z.object({
  status: z.enum(CONTACT_SUBMISSION_STATUSES),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
export type UpdateContactStatusInput = z.infer<typeof contactStatusSchema>;
