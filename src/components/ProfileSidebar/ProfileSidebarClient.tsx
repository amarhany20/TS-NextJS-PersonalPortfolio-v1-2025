'use client';

import Image from 'next/image';
import { MapPin, Globe, X } from 'lucide-react';
import { useSidebar } from '@/components/ui/SidebarProvider';
// Import package.json to read the project version for display in the sidebar footer
import { APP_VERSION } from '@/lib/version';
import type { ProfileInfo } from '@/types/settings';

interface ProfileSidebarProps {
  profile: ProfileInfo;
  coreSkills: string[];
  languages: readonly string[];
}

export default function ProfileSidebarClient({
  profile,
  coreSkills,
  languages,
}: ProfileSidebarProps) {
  const { leftSidebarOpen, closeAllSidebars } = useSidebar();

  if (!profile?.fullName) return null;

  // Extract data from metadata structure
  const displayName = profile.fullName || '';
  const primaryLocation = profile.location || '';
  const profileTitle = profile.title || '';
  const photo = profile.photoUrl || '/2024 Ammar Personal Photo.jpg';

  return (
    <>
      {/* Mobile Overlay */}
      {leftSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[999] lg:hidden" onClick={closeAllSidebars} />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen w-[280px] bg-[var(--sidebar)] border-r border-[var(--border)] overflow-y-auto z-[1002] transition-transform duration-300 ease-in-out
        ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col p-6
      `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={closeAllSidebars}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--accent-muted)] lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} className="text-[var(--text-secondary)]" />
        </button>

        {/* Photo */}
        <div className="flex-shrink-0 w-28 h-28 rounded-full border-4 border-[var(--accent-primary)] overflow-hidden shadow-lg mb-4 mx-auto">
          <Image
            src={photo}
            alt={displayName}
            width={112}
            height={112}
            className="object-cover w-full h-full"
            priority
            style={{ objectPosition: 'center 15%' }} // Moves image down
          />
        </div>

        {/* Name & Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-1">{displayName}</h2>
          <p className="text-base text-[var(--accent-secondary)]">{profileTitle}</p>
        </div>

        {/* Location */}
        <div className="mb-4">
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <MapPin size={18} />
            <span className="text-sm">{primaryLocation}</span>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[var(--border)] mb-4" />

        {/* Core Skills */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[var(--accent-primary)] mb-2">Core Skills</h3>
          <div className="flex flex-wrap gap-2">
            {coreSkills?.slice(0, 16).map((skill, idx) => (
              <span
                key={`${skill}-${idx}`}
                className="bg-[var(--accent-muted)] text-sm rounded px-3 py-1 text-[var(--foreground)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[var(--border)] mb-4" />

        {/* Languages (simple list from metadata) */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[var(--accent-primary)] mb-3">Languages</h3>
          <div className="space-y-2">
            {languages.slice(0, 5).map((l) => (
              <div key={l} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <Globe size={14} className="text-[var(--accent-primary)]" />
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[var(--border)] mb-4" />

        {/* Bottom - Version & Copyright */}
        <div className="mt-auto text-center text-sm text-[var(--text-secondary)]">
          <div>
            © {new Date().getFullYear()} ammarhany.com - V{APP_VERSION}
          </div>
        </div>
      </aside>
    </>
  );
}
