import type { DbEducation } from '@/server/repositories/EducationRepository';
import type { Education } from '@/types/education';
import { formatYearMonth } from './utils';

export function serializeEducation(record: DbEducation): Education {
  const start = formatYearMonth(record.startDate);
  const end = formatYearMonth(record.endDate ?? undefined) || undefined;

  return {
    id: record.id,
    institution: record.institution,
    degree: record.degree,
    field: record.field ?? undefined,
    location: record.location ?? undefined,
    start,
    end,
    present: record.present,
    gpa: record.gpa ?? undefined,
    achievements: record.achievements,
    project: record.project ?? undefined,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
