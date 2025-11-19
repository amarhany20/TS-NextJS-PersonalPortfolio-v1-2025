import type { DbSkillGroup } from '@/server/repositories/SkillRepository';
import type { SkillGroupDisplay } from '@/types/skill';

export function serializeSkillGroup(group: DbSkillGroup): SkillGroupDisplay {
  return {
    id: group.slug,
    title: group.title,
    summary: group.summary ?? undefined,
    skills: group.skills.map((skill) => ({
      name: skill.name,
    })),
  };
}
