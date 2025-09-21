"use client";
import ProfileSidebarClient from './ProfileSidebarClient';
import { useProfileData } from '@/hooks/useStaticData';

export default function ProfileSidebar() {
  const { personalInfo, coreSkills, languages } = useProfileData();
  type CoreSkillShape = { id: number; name: string };
  const mappedCore: CoreSkillShape[] = (coreSkills || []).map(s => ({
    id: (s as unknown as { id: number }).id,
    name: (s as unknown as { name: string }).name,
  }));
  return <ProfileSidebarClient personalInfo={personalInfo} coreSkills={mappedCore} languages={languages || []} />;
}
