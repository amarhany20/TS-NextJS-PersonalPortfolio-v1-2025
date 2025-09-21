"use client";

import NavLinks from "./NavLinks";
import SocialLinks from "./SocialLinks";
import { useSidebar } from "@/components/UI/SidebarProvider";
import { X } from "lucide-react";

export default function NavSidebar() {
  const { rightSidebarOpen, closeAllSidebars } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {rightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-[999] lg:hidden" onClick={closeAllSidebars} />}

      {/* Sidebar */}
      <aside
        className={`
  fixed top-0 right-0 h-screen w-[108px] bg-[var(--sidebar)] backdrop-blur-md border-l border-[var(--border)] shadow-lg 
        transform transition-transform duration-300 ease-in-out z-[1002]
        ${rightSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex flex-col h-full p-2">
          {/* Close Button (Mobile) */}
          <button onClick={closeAllSidebars} className="absolute top-2 right-2 p-1 hover:bg-[var(--accent-secondary)]/20 rounded-full transition-colors lg:hidden" aria-label="Close navigation">
            <X size={16} className="text-[var(--text-secondary)]" />
          </button>

          {/* Navigation Links */}
          <div className="flex-1 pt-8 lg:pt-2">
            <NavLinks />
          </div>

          {/* Social Links */}
          <div className="mt-auto pb-2">
            <SocialLinks />
          </div>
        </div>
      </aside>
    </>
  );
}
