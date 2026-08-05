import { RecommendationRepository } from '@/server/repositories/RecommendationRepository';
import { serializeRecommendation } from '@/server/serializers/recommendation';
import { NotFoundError, ValidationError } from '@/server/http/errors';
import { nullIfEmpty, parseISODate } from '@/server/server-utils/dates';
import type {
  CreateRecommendationInput,
  UpdateRecommendationInput,
} from '@/server/server-validators/api/recommendation';

export const RecommendationService = {
  async getRecommendations() {
    const records = await RecommendationRepository.findPublished();
    return records.map(serializeRecommendation);
  },

  async getAllRecommendations() {
    const records = await RecommendationRepository.findAll();
    return records.map(serializeRecommendation);
  },

  async getRecommendationById(id: string) {
    const record = await RecommendationRepository.findById(id);
    return record ? serializeRecommendation(record) : null;
  },

  async createRecommendation(input: CreateRecommendationInput) {
    const receivedOn = parseReceivedOn(input.receivedOn);

    const record = await RecommendationRepository.create({
      name: input.name,
      position: nullIfEmpty(input.position),
      company: nullIfEmpty(input.company),
      relationship: nullIfEmpty(input.relationship),
      content: input.content,
      rating: input.rating ?? null,
      linkedin: nullIfEmpty(input.linkedin),
      recommendationLetterUrl: nullIfEmpty(input.recommendationLetterUrl),
      photo: nullIfEmpty(input.photo),
      receivedOn,
      displayOrder: input.displayOrder ?? (await RecommendationRepository.getNextDisplayOrder()),
      published: input.published ?? false,
    });

    return serializeRecommendation(record);
  },

  async updateRecommendation(id: string, input: UpdateRecommendationInput) {
    const existing = await RecommendationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Recommendation not found');
    }

    const receivedOn =
      input.receivedOn !== undefined ? parseReceivedOn(input.receivedOn) : undefined;

    const record = await RecommendationRepository.update(id, {
      name: input.name,
      position: valueOrNull(input.position),
      company: valueOrNull(input.company),
      relationship: valueOrNull(input.relationship),
      content: input.content,
      rating: input.rating,
      linkedin: valueOrNull(input.linkedin),
      recommendationLetterUrl: valueOrNull(input.recommendationLetterUrl),
      photo: valueOrNull(input.photo),
      receivedOn,
      displayOrder: input.displayOrder,
      published: input.published,
    });

    if (!record) {
      throw new NotFoundError('Recommendation not found');
    }

    return serializeRecommendation(record);
  },

  async deleteRecommendation(id: string) {
    const deleted = await RecommendationRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Recommendation not found');
    }
  },
};

function valueOrNull(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return nullIfEmpty(value);
}

function parseReceivedOn(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = parseISODate(value);
  if (!parsed) {
    throw new ValidationError('Received date must be a valid ISO date');
  }

  return parsed;
}
