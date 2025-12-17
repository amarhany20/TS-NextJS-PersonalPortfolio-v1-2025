"use client";

import Link from "next/link";
import { User, Menu } from "lucide-react";
import { useSidebar } from "./SidebarProvider";

interface TopHeaderProps {
  brandLabel?: string;
}

export default function TopHeader({ brandLabel }: TopHeaderProps) {
  const { toggleLeftSidebar, toggleRightSidebar, leftSidebarOpen, rightSidebarOpen } = useSidebar();
  const label = brandLabel && brandLabel.trim().length > 0 ? brandLabel : "AH";

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-[var(--sidebar)] border-b border-[var(--border)] flex items-center justify-between px-4 z-[1001] shadow-lg lg:hidden">
      <button
        onClick={toggleLeftSidebar}
        aria-label={leftSidebarOpen ? "Close profile menu" : "Open profile menu"}
        className={`
          rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]
          ${leftSidebarOpen ? "bg-[var(--accent-primary)] text-black" : "hover:bg-[var(--accent-muted)] text-[var(--accent-primary)]"}
        `}>
        <User size={24} />
      </button>

      <Link
        href="/"
        className="text-xl font-bold tracking-widest text-[var(--accent-primary)] hover:opacity-80 transition-opacity"
        aria-label="Go to home"
      >
        {label}
      </Link>

      <button
        onClick={toggleRightSidebar}
        aria-label={rightSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        className={`
          rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-secondary)]
          ${rightSidebarOpen ? "bg-[var(--accent-secondary)] text-black" : "hover:bg-[var(--accent-muted)] text-[var(--accent-secondary)]"}
        `}>
        <Menu size={24} />
      </button>
    </header>
  );
}
