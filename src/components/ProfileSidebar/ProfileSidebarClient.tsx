"use client";

import Image from "next/image";
import { MapPin, Globe, X } from "lucide-react";
import { useSidebar } from "@/components/UI/SidebarProvider";
// Import package.json to read the project version for display in the sidebar footer
import { APP_VERSION } from '@/lib/version';

interface ProfileSidebarProps {
  personalInfo: Record<string, string | number | boolean | object> | null;
  coreSkills: Array<{ id: number; name: string }> | null;
  languages: Array<{ name: string; level: string; flag: string }> | null;
}

export default function ProfileSidebarClient({ personalInfo, coreSkills, languages }: ProfileSidebarProps) {
  const { leftSidebarOpen, closeAllSidebars } = useSidebar();

  if (!personalInfo) return null;

  // Extract data from metadata structure
  const displayName = (personalInfo.fullName as string) || (personalInfo.personal_display_name as string) || "";
  const primaryLocation = ((personalInfo.location as string) || "").toString();
  const profileTitle = ((personalInfo.title as string) || "").toString();

  return (
    <>
      {/* Mobile Overlay */}
      {leftSidebarOpen && <div className="fixed inset-0 bg-black/50 z-[999] lg:hidden" onClick={closeAllSidebars} />}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen w-[280px] bg-[var(--sidebar)] border-r border-[var(--border)] overflow-y-auto z-[1002] transition-transform duration-300 ease-in-out
        ${leftSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col p-6
      `}>
        {/* Mobile Close Button */}
        <button onClick={closeAllSidebars} className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--accent-muted)] lg:hidden" aria-label="Close sidebar">
          <X size={20} className="text-[var(--text-secondary)]" />
        </button>

        {/* Photo */}
        <div className="flex-shrink-0 w-28 h-28 rounded-full border-4 border-[var(--accent-primary)] overflow-hidden shadow-lg mb-4 mx-auto">
          <Image
            src="/2024 Ammar Personal Photo.jpg"
            alt={displayName}
            width={112}
            height={112}
            className="object-cover w-full h-full"
            priority
            style={{ objectPosition: "center 15%" }} // Moves image down
          />
        </div>

        {/* Name & Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-1">{displayName}</h2>
          <p className="text-md text-[var(--accent-secondary)]">{profileTitle}</p>
        </div>

        {/* Location */}
        <div className="mb-4">
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <MapPin size={16} />
            <span className="text-sm">{primaryLocation}</span>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[var(--border)] mb-4" />

        {/* Core Skills */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[var(--accent-primary)] mb-2">Core Skills</h3>
          <div className="flex flex-wrap gap-2">
            {coreSkills?.slice(0, 5).map((skill) => (
              <span key={skill.id} className="bg-[var(--accent-muted)] text-xs rounded px-2 py-1 text-[var(--foreground)]">
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[var(--border)] mb-4" />

        {/* Languages */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[var(--accent-primary)] mb-3">Languages</h3>
          <div className="space-y-3">
            {languages?.slice(0, 4).map((lang) => (
              <div key={lang.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe size={12} className="text-[var(--accent-primary)] flex-shrink-0" />
                  <span className="text-[var(--foreground)] text-sm font-medium">{lang.name}</span>
                </div>
                <span className="text-[var(--text-secondary)] text-xs">{lang.level.split(" –")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[var(--border)] mb-4" />

        {/* Bottom - Version & Copyright */}
        <div className="mt-auto text-center text-xs text-[var(--text-secondary)]">
          <div>ammarhany.com @ 2025 - V{APP_VERSION}</div>
          <div className="mt-1">© {new Date().getFullYear()}</div>
        </div>
      </aside>
    </>
  );
}
