"use client";

import ProfileSidebarClient from "./ProfileSidebarClient";
import { useProfileData } from "@/hooks/useApiData";
import { Loader2 } from "lucide-react";
import type { Skill } from "@/types/database";

export default function ProfileSidebar() {
  const { personalInfo, coreSkills, languages, loading, error } = useProfileData();

  if (loading) {
    return (
      <div className="fixed left-0 top-0 h-screen w-80 bg-[var(--sidebar)] backdrop-blur-md border-r border-[var(--border)] z-[900] transform -translate-x-full lg:translate-x-0 transition-transform duration-300 overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-primary)]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed left-0 top-0 h-screen w-80 bg-[var(--sidebar)] backdrop-blur-md border-r border-[var(--border)] z-[900] transform -translate-x-full lg:translate-x-0 transition-transform duration-300 overflow-y-auto">
        <div className="flex items-center justify-center h-full p-4">
          <p className="text-red-500 text-sm text-center">Error loading profile data</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileSidebarClient
      personalInfo={personalInfo}
  coreSkills={(coreSkills as Skill[] | null)?.map((s) => ({ id: s.id, name: s.name })) || []}
      languages={languages || []}
    />
  );
}
