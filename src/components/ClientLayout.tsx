"use client";

import React, { useMemo } from "react";
import ProfileSidebar from "@/components/ProfileSidebar";
import NavSidebar from "@/components/NavSidebar";
import TopHeader from "@/components/ui/TopHeader";
import Footer from "@/components/ui/Footer";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { SidebarProvider } from "@/components/ui/SidebarProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
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
  const pathname = usePathname();

  const brandLabel = useMemo(() => {
    const initials = deriveInitials(siteContent.profile?.fullName);
    return initials || "AH";
  }, [siteContent.profile?.fullName]);

  const socialLinks = useMemo(
    () => mergeSocialLinks(siteContent.socialLinks, siteContent.contact?.socialLinks ?? []),
    [siteContent.contact?.socialLinks, siteContent.socialLinks],
  );

  const isAdminPath = pathname.startsWith("/admin");

  return (
    <ToastProvider>
      <SidebarProvider>
        {/* Animated Background */}
        <AnimatedBackground />

        {!isAdminPath && (
          <>
            {/* Mobile Header */}
            <TopHeader brandLabel={brandLabel} />
          </>
        )}

        {!isAdminPath && (
          <>
            {/* Fixed Sidebars */}
            <ProfileSidebar profile={siteContent.profile} coreSkills={siteContent.coreSkills} languages={siteContent.languages} />
            <NavSidebar socialLinks={socialLinks} visibility={siteContent.visibility} />
          </>
        )}

        {/* Main Content: fixed, scrollable, between sidebars */}
        <main
          className={`fixed top-0 left-0 right-0 bottom-0 px-6 md:px-8 lg:px-12 py-6 pt-16 lg:pt-8 overflow-y-auto bg-[var(--background)]`}
          style={{
            zIndex: 10,
            left: isAdminPath ? "0px" : "var(--sidebar-left-width, 280px)",
            right: isAdminPath ? "0px" : "var(--sidebar-right-width, 108px)",
          }}
        >
          <div className="w-full max-w-none space-y-6 lg:space-y-8 mx-auto">
            {children}
            <Footer />
          </div>
        </main>
      </SidebarProvider>
    </ToastProvider>
  );
}
