import type { Metadata } from 'next';

import { SkillGroupForm } from '@/components/Admin/Skills/SkillGroupForm';

export const metadata: Metadata = {
  title: 'New Skill Group | Admin',
};

export default function AdminSkillGroupCreatePage() {
  return <SkillGroupForm mode="create" />;
}
