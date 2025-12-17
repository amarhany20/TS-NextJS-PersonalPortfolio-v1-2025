import { BadRequestError, NotFoundError } from '@/server/http/errors';
import { ContactSubmissionRepository } from '@/server/repositories/ContactSubmissionRepository';
import { serializeContactSubmission } from '@/server/serializers/contactSubmission';
import type { ContactSubmissionStatus } from '@/types/contact';
import type { ContactSubmissionInput } from '@/server/server-validators/api/contact';

const MAX_MESSAGE_LENGTH = 5000;

export const ContactSubmissionService = {
  async submitContact(input: ContactSubmissionInput) {
    const payload = normalizeContactInput(input);

    const record = await ContactSubmissionRepository.create({
      ...payload,
      status: 'new',
    });

    return serializeContactSubmission(record);
  },

  async listSubmissions(filter: { status?: ContactSubmissionStatus } = {}) {
    const records = await ContactSubmissionRepository.findAll(filter);
    return records.map(serializeContactSubmission);
  },

  async updateSubmissionStatus(id: string, status: ContactSubmissionStatus) {
    const record = await ContactSubmissionRepository.updateStatus(id, status);
    if (!record) {
      throw new NotFoundError('Contact submission not found');
    }

    return serializeContactSubmission(record);
  },

  async deleteSubmission(id: string) {
    const deleted = await ContactSubmissionRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Contact submission not found');
    }
  },
};

function normalizeContactInput(input: ContactSubmissionInput) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const subject = input.subject?.trim();
  const phone = input.phone?.trim();
  const message = input.message.trim();

  if (!name || !email || !message) {
    throw new BadRequestError('Name, email, and message are required.');
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new BadRequestError('Message exceeds maximum length.');
  }

  return {
    name,
    email,
    subject: subject?.length ? subject : null,
    phone: phone?.length ? phone : null,
    message,
  };
}
