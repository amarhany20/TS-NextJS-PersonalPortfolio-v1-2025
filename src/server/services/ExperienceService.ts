import { ExperienceRepository } from '@/server/repositories/ExperienceRepository';
import { serializeExperience } from '@/server/serializers/experience';
import { nullIfEmpty, parseYearMonth } from '@/server/server-utils/dates';
import { NotFoundError, ValidationError } from '@/server/http/errors';
import type {
  CreateExperienceInput,
  UpdateExperienceInput,
} from '@/server/server-validators/api/experience';

export const ExperienceService = {
  async getPublishedExperience() {
    const records = await ExperienceRepository.findPublished();
    return records.map(serializeExperience);
  },

  async getAllExperience() {
    const records = await ExperienceRepository.findAll();
    return records.map(serializeExperience);
  },

  async getExperienceById(id: string) {
    const record = await ExperienceRepository.findById(id);
    return record ? serializeExperience(record) : null;
  },

  async createExperience(input: CreateExperienceInput) {
    const startDate = parseYearMonth(input.start);
    if (!startDate) {
      throw new ValidationError('Invalid start date format');
    }
    const endDate = (input.present ?? false) ? null : input.end ? parseYearMonth(input.end) : null;
    if (input.end && !endDate && !(input.present ?? false)) {
      throw new ValidationError('Invalid end date format');
    }

    const record = await ExperienceRepository.create({
      company: input.company,
      title: input.title,
      location: nullIfEmpty(input.location),
      startDate,
      endDate: endDate ?? null,
      present: input.present ?? false,
      impact: nullIfEmpty(input.impact),
      achievements: input.achievements ?? [],
      skills: input.skills ?? [],
      companyUrl: nullIfEmpty(input.companyUrl),
      displayOrder: input.displayOrder ?? (await ExperienceRepository.getNextDisplayOrder()),
      published: input.published ?? false,
    });

    return serializeExperience(record);
  },

  async updateExperience(id: string, input: UpdateExperienceInput) {
    const existing = await ExperienceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Experience not found');
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

    const record = await ExperienceRepository.update(id, {
      company: input.company,
      title: input.title,
      location: valueOrNull(input.location),
      startDate,
      endDate,
      present: input.present,
      impact: valueOrNull(input.impact),
      achievements: input.achievements,
      skills: input.skills,
      companyUrl: valueOrNull(input.companyUrl),
      displayOrder: input.displayOrder,
      published: input.published,
    });

    if (!record) {
      throw new NotFoundError('Experience not found');
    }

    return serializeExperience(record);
  },

  async deleteExperience(id: string) {
    const deleted = await ExperienceRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Experience not found');
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
