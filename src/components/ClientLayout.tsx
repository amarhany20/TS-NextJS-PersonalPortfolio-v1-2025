"use client";

import React from "react";
import ProfileSidebar from "@/components/ProfileSidebar";
import NavSidebar from "@/components/NavSidebar";
import TopHeader from "@/components/UI/TopHeader";
import Footer from "@/components/UI/Footer";
import AnimatedBackground from "@/components/UI/AnimatedBackground";
import { SidebarProvider } from "@/components/UI/SidebarProvider";
import { AuthProvider } from "@/hooks/useAuthContext";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // For admin routes, don't render public site chrome (sidebars, background, footer)
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <SidebarProvider>
        {/* Animated Background */}
        <AnimatedBackground />

        {/* Mobile Header */}
        <TopHeader />

        {/* Fixed Sidebars */}
        <ProfileSidebar />
        <NavSidebar />

        {/* Main Content: fixed, scrollable, between sidebars */}
        <main className="fixed top-0 left-0 right-0 bottom-0 lg:left-[280px] lg:right-[120px] px-6 md:px-8 lg:px-12 py-6 pt-16 lg:pt-8 overflow-y-auto bg-[var(--background)]" style={{ zIndex: 10 }}>
          <div className="w-full max-w-none space-y-6 lg:space-y-8 mx-auto">
            {children}
            <Footer />
          </div>
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}
