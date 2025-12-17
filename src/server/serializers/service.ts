import type { DbService } from '@/server/repositories/ServiceRepository';
import type { Service } from '@/types/service';

export function serializeService(record: DbService): Service {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    description: record.description,
    longDescription: record.longDescription ?? undefined,
    features: record.features,
    technologies: record.technologies,
    icon: record.icon ?? undefined,
    image: record.image ?? undefined,
    active: record.active,
    displayOrder: record.displayOrder,
  };
}
