import type { DbExperience } from '@/server/repositories/ExperienceRepository';
import type { Experience } from '@/types/experience';
import { formatYearMonth } from './utils';

export function serializeExperience(record: DbExperience): Experience {
  const start = formatYearMonth(record.startDate);
  const end = formatYearMonth(record.endDate ?? undefined) || undefined;
  const impact = record.impact?.trim() || record.achievements[0] || '';

  return {
    id: record.id,
    company: record.company,
    title: record.title,
    location: record.location ?? '',
    start,
    end,
    present: record.present,
    impact,
    achievements: record.achievements,
    skills: record.skills,
    companyUrl: record.companyUrl,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
