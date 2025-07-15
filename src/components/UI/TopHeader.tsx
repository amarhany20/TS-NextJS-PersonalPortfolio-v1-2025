"use client";

import { useState } from "react";
import { User, Share2 } from "lucide-react";

export default function TopHeader() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-[var(--sidebar)] border-b border-[var(--border)] flex items-center justify-between px-4 z-50 shadow-lg lg:hidden">
      {/* Left: ProfileSidebar toggle */}
      <button onClick={toggleLeftSidebar} aria-label="Open profile menu" className="rounded-full p-2 hover:bg-[var(--accent-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors">
        <User size={24} className="text-[var(--accent-primary)]" />
      </button>

      {/* Center: Brand/Logo/Initials */}
      <div className="text-xl font-bold tracking-widest text-[var(--accent-primary)]">AH</div>

      {/* Right: NavSidebar/social toggle */}
      <button onClick={toggleRightSidebar} aria-label="Open navigation menu" className="rounded-full p-2 hover:bg-[var(--accent-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)] transition-colors">
        <Share2 size={24} className="text-[var(--accent-secondary)]" />
      </button>
    </header>
  );
}
