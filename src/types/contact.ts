export const CONTACT_SUBMISSION_STATUSES = [
  'new',
  'in_progress',
  'resolved',
  'archived',
] as const;

export type ContactSubmissionStatus = (typeof CONTACT_SUBMISSION_STATUSES)[number];

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: ContactSubmissionStatus;
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
