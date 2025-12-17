import type { DbContactSubmission } from '@/server/repositories/ContactSubmissionRepository';
import type { ContactSubmission } from '@/types/contact';

export function serializeContactSubmission(record: DbContactSubmission): ContactSubmission {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    phone: record.phone ?? undefined,
    subject: record.subject ?? undefined,
    message: record.message,
    status: record.status,
    meta: record.meta ?? undefined,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
