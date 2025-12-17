import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { SkillGroupForm } from '@/components/Admin/Skills/SkillGroupForm';
import { SkillService } from '@/server/services/SkillService';

interface AdminSkillGroupEditPageProps {
  params: {
    slug: string;
  };
}

const loadGroup = cache((slug: string) => SkillService.getSkillGroupBySlug(slug));

export async function generateMetadata({ params }: AdminSkillGroupEditPageProps): Promise<Metadata> {
  const group = await loadGroup(params.slug);
  return {
    title: group ? `Edit ${group.title} | Admin Skills` : 'Skill group not found',
  };
}

export default async function AdminSkillGroupEditPage({ params }: AdminSkillGroupEditPageProps) {
  const group = await loadGroup(params.slug);

  if (!group) {
    notFound();
  }

  return <SkillGroupForm mode="edit" group={group} />;
}
