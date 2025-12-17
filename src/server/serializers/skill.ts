import type { DbSkillGroup } from '@/server/repositories/SkillRepository';
import type { SkillGroupDisplay } from '@/types/skill';

export function serializeSkillGroup(group: DbSkillGroup): SkillGroupDisplay {
  return {
    id: group.slug,
    title: group.title,
    summary: group.summary ?? undefined,
    displayOrder: group.displayOrder,
    published: group.published ?? true,
    skills: group.skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      displayOrder: skill.displayOrder,
    })),
  };
}
