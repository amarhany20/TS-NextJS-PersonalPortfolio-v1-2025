import { EducationRepository } from '@/server/repositories/EducationRepository';
import { serializeEducation } from '@/server/serializers/education';
import { nullIfEmpty, parseYearMonth } from '@/server/server-utils/dates';
import { NotFoundError, ValidationError } from '@/server/http/errors';
import type {
  CreateEducationInput,
  UpdateEducationInput,
} from '@/server/server-validators/api/education';

export const EducationService = {
  async getPublishedEducation() {
    const records = await EducationRepository.findPublished();
    return records.map(serializeEducation);
  },

  async getAllEducation() {
    const records = await EducationRepository.findAll();
    return records.map(serializeEducation);
  },

  async getEducationById(id: string) {
    const record = await EducationRepository.findById(id);
    return record ? serializeEducation(record) : null;
  },

  async createEducation(input: CreateEducationInput) {
    const startDate = parseYearMonth(input.start);
    if (!startDate) {
      throw new ValidationError('Invalid start date format');
    }

    const endDate = (input.present ?? false) ? null : input.end ? parseYearMonth(input.end) : null;
    if (input.end && !endDate && !(input.present ?? false)) {
      throw new ValidationError('Invalid end date format');
    }

    const record = await EducationRepository.create({
      id: input.id,
      institution: input.institution,
      degree: input.degree,
      field: nullIfEmpty(input.field),
      location: nullIfEmpty(input.location),
      startDate,
      endDate,
      present: input.present ?? false,
      gpa: nullIfEmpty(input.gpa),
      achievements: input.achievements ?? [],
      project: nullIfEmpty(input.project),
      displayOrder: input.displayOrder ?? (await EducationRepository.getNextDisplayOrder()),
      published: input.published ?? false,
    });

    return serializeEducation(record);
  },

  async updateEducation(id: string, input: UpdateEducationInput) {
    const existing = await EducationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Education record not found');
    }

    const startDate =
      input.start !== undefined
        ? (parseYearMonth(input.start) ?? raiseValidation('Invalid start date format'))
        : undefined;
    const endDate =
      input.end !== undefined
        ? (parseYearMonth(input.end) ?? raiseValidation('Invalid end date format'))
        : input.present !== undefined
          ? input.present
            ? null
            : existing.endDate
          : undefined;

    const record = await EducationRepository.update(id, {
      institution: input.institution,
      degree: input.degree,
      field: valueOrNull(input.field),
      location: valueOrNull(input.location),
      startDate,
      endDate,
      present: input.present,
      gpa: valueOrNull(input.gpa),
      achievements: input.achievements,
      project: valueOrNull(input.project),
      displayOrder: input.displayOrder,
      published: input.published,
    });

    if (!record) {
      throw new NotFoundError('Education record not found');
    }

    return serializeEducation(record);
  },

  async deleteEducation(id: string) {
    const deleted = await EducationRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Education record not found');
    }
  },
};

function valueOrNull(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return nullIfEmpty(value);
}

function raiseValidation(message: string): never {
  throw new ValidationError(message);
}
