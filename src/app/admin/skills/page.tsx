import type { Metadata } from 'next';

import { SkillGroupsManager } from '@/components/Admin/Skills/SkillGroupsManager';
import { SkillService } from '@/server/services/SkillService';

export const metadata: Metadata = {
  title: 'Skills | Admin',
};

export default async function AdminSkillsPage() {
  const skillGroups = await SkillService.getSkillGroups();
  return <SkillGroupsManager initialSkillGroups={skillGroups} />;
}
