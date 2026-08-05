import { SkillRepository } from '@/server/repositories/SkillRepository';
import { serializeSkillGroup } from '@/server/serializers/skill';
import { ConflictError, NotFoundError } from '@/server/http/errors';
import type {
  CreateSkillGroupInput,
  UpdateSkillGroupInput,
} from '@/server/server-validators/api/skill';
import { slugify } from '@/utils/helpers';

export const SkillService = {
  async getSkillGroups() {
    const groups = await SkillRepository.findAllGroups();
    return groups.map(serializeSkillGroup);
  },

  async getSkillGroupBySlug(slug: string) {
    const group = await SkillRepository.findBySlug(slug);
    return group ? serializeSkillGroup(group) : null;
  },

  async createSkillGroup(input: CreateSkillGroupInput) {
    const baseSlug = input.slug ?? slugify(input.title);
    const slug = await ensureUniqueSlug(baseSlug || input.title);

    const group = await SkillRepository.createGroup({
      slug,
      title: input.title,
      summary: input.summary,
      displayOrder: input.displayOrder ?? (await SkillRepository.getNextDisplayOrder()),
      published: input.published ?? true,
      skills: dedupeSkills(input.skills),
    });

    return serializeSkillGroup(group);
  },

  async updateSkillGroup(slug: string, input: UpdateSkillGroupInput) {
    const existing = await SkillRepository.findBySlug(slug);
    if (!existing) {
      throw new NotFoundError('Skill group not found');
    }

    const nextSlug =
      input.slug !== undefined ? await ensureUniqueSlug(input.slug, existing.id) : undefined;

    const group = await SkillRepository.updateGroup(slug, {
      slug: nextSlug,
      title: input.title,
      summary: input.summary,
      displayOrder: input.displayOrder,
      published: input.published,
      skills: dedupeSkills(input.skills),
    });

    if (!group) {
      throw new NotFoundError('Skill group not found');
    }

    return serializeSkillGroup(group);
  },

  async deleteSkillGroup(slug: string) {
    const deleted = await SkillRepository.deleteGroup(slug);
    if (!deleted) {
      throw new NotFoundError('Skill group not found');
    }
  },
};

async function ensureUniqueSlug(candidate: string, excludeId?: string) {
  let base = slugify(candidate).replace(/^-+|-+$/g, '');
  if (!base) {
    base = 'skill-group';
  }

  let attempt = base;
  let counter = 1;

  while (await SkillRepository.isSlugTaken(attempt, excludeId)) {
    counter += 1;
    attempt = `${base}-${counter}`;
    if (counter > 1000) {
      throw new ConflictError('Unable to generate unique slug');
    }
  }

  return attempt;
}

function dedupeSkills(skills?: CreateSkillGroupInput['skills']) {
  if (!skills) {
    return undefined;
  }

  const seen = new Set<string>();
  const result: CreateSkillGroupInput['skills'] = [];

  for (const skill of skills) {
    const name = skill.name.trim();
    const key = name.toLowerCase();
    if (!name || seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push({ ...skill, name });
  }

  return result;
}
