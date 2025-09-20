"use client";
import ProfileSidebarClient from './ProfileSidebarClient';
import { useProfileData } from '@/hooks/useStaticData';
import { Loader2 } from 'lucide-react';

export default function ProfileSidebar() {
  const { personalInfo, coreSkills, languages, loading, error } = useProfileData();

  if (loading) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-[280px] bg-[var(--sidebar)] border-r border-[var(--border)] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--accent-primary)]" />
      </aside>
    );
  }
  if (error) {
    return (
      <aside className="fixed top-0 left-0 h-screen w-[280px] bg-[var(--sidebar)] border-r border-[var(--border)] p-4 text-sm text-red-500 flex items-center">Sidebar load error</aside>
    );
  }
  type CoreSkillShape = { id: number; name: string };
  const mappedCore: CoreSkillShape[] = (coreSkills || []).map(s => ({
    id: (s as unknown as { id: number }).id,
    name: (s as unknown as { name: string }).name,
  }));
  return <ProfileSidebarClient personalInfo={personalInfo} coreSkills={mappedCore} languages={languages || []} />;
}
