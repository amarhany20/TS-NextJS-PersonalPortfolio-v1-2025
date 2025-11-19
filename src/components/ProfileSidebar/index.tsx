"use client";

import ProfileSidebarClient from './ProfileSidebarClient';
import type { ProfileInfo } from '@/types/settings';

interface ProfileSidebarProps {
  profile: ProfileInfo;
  coreSkills: string[];
  languages: string[];
}

export default function ProfileSidebar({ profile, coreSkills, languages }: ProfileSidebarProps) {
  return <ProfileSidebarClient profile={profile} coreSkills={coreSkills} languages={languages} />;
}
