import { describe, expect, it } from 'vitest';

import type { DbSkillGroup } from '@/server/repositories/SkillRepository';
import { serializeSkillGroup } from '../skill';

describe('serializeSkillGroup', () => {
  it('maps skill group and nested skills', () => {
    const record: DbSkillGroup = {
      id: 'group-1',
      slug: 'backend',
      title: 'Backend',
      summary: null,
      displayOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      skills: [
        { id: '1', name: 'Node.js', icon: null, level: null, keywords: undefined, displayOrder: 0, groupId: 'group-1' },
      ],
    };

    const result = serializeSkillGroup(record);

    expect(result).toEqual({
      id: 'backend',
      title: 'Backend',
      summary: undefined,
      displayOrder: 1,
      published: true,
      skills: [{ id: '1', name: 'Node.js', displayOrder: 0 }],
    });
  });
});
