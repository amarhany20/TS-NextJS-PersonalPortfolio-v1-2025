import type { DbRecommendation } from '@/server/repositories/RecommendationRepository';
import type { Recommendation } from '@/types/recommendation';

export function serializeRecommendation(record: DbRecommendation): Recommendation {
  return {
    id: record.id,
    name: record.name,
    position: record.position ?? undefined,
    company: record.company ?? undefined,
    relationship: record.relationship ?? undefined,
    content: record.content,
    rating: record.rating ?? undefined,
    linkedin: record.linkedin ?? undefined,
    recommendationLetterUrl: record.recommendationLetterUrl ?? undefined,
    photo: record.photo ?? undefined,
    date: record.receivedOn ? record.receivedOn.toISOString() : undefined,
    displayOrder: record.displayOrder,
    published: record.published,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
