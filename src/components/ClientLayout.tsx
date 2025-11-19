"use client";

import React, { useMemo } from "react";
import ProfileSidebar from "@/components/ProfileSidebar";
import NavSidebar from "@/components/NavSidebar";
import TopHeader from "@/components/UI/TopHeader";
import Footer from "@/components/UI/Footer";
import AnimatedBackground from "@/components/UI/AnimatedBackground";
import { SidebarProvider } from "@/components/UI/SidebarProvider";
import { usePathname } from "next/navigation";
import type { LinkItem, SiteContent } from "@/types/settings";

interface ClientLayoutProps {
  children: React.ReactNode;
  siteContent: SiteContent;
}

function deriveInitials(fullName?: string): string {
  if (!fullName) return "";
  const parts = fullName
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase())
    .filter(Boolean);
  if (!parts.length) return "";
  const preferred = parts.slice(0, 2).join("");
  return preferred || parts[0] || "";
}

function mergeSocialLinks(primary: LinkItem[], secondary: LinkItem[]): LinkItem[] {
  const combined = [...primary, ...secondary];
  const unique: LinkItem[] = [];
  combined.forEach((link) => {
    if (!link?.href) {
      return;
    }
    if (!unique.some((existing) => existing.href === link.href)) {
      unique.push(link);
    }
  });
  return unique;
}

export default function ClientLayout({ children, siteContent }: ClientLayoutProps) {
  usePathname(); // retained for potential future logic

  const brandLabel = useMemo(() => {
    const initials = deriveInitials(siteContent.profile?.fullName);
    return initials || "AH";
  }, [siteContent.profile?.fullName]);

  const socialLinks = useMemo(
    () => mergeSocialLinks(siteContent.socialLinks, siteContent.contact?.socialLinks ?? []),
    [siteContent.contact?.socialLinks, siteContent.socialLinks],
  );

  return (
    <SidebarProvider>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Mobile Header */}
      <TopHeader brandLabel={brandLabel} />

      {/* Fixed Sidebars */}
      <ProfileSidebar profile={siteContent.profile} coreSkills={siteContent.coreSkills} languages={siteContent.languages} />
      <NavSidebar socialLinks={socialLinks} />

      {/* Main Content: fixed, scrollable, between sidebars */}
	<main className="fixed top-0 left-0 right-0 bottom-0 lg:left-[280px] lg:right-[108px] px-6 md:px-8 lg:px-12 py-6 pt-16 lg:pt-8 overflow-y-auto bg-[var(--background)]" style={{ zIndex: 10 }}>
        <div className="w-full max-w-none space-y-6 lg:space-y-8 mx-auto">
          {children}
          <Footer />
        </div>
      </main>
    </SidebarProvider>
  );
}
