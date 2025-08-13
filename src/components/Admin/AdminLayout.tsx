/**
 * Clean Admin Layout - Portfolio Management Interface
 *
 * 🎯 PURPOSE: Clean, professional admin interface for managing portfolio content
 * 🔒 SECURITY: Protected by authentication - login required
 * 🎨 DESIGN: Modern, responsive design with proper header and sidebar
 * 📱 MOBILE: Fully responsive for desktop and mobile
 *
 * FEATURES:
 * - Clean header with logo and logout
 * - Organized sidebar navigation
 * - Contact leads management
 * - Portfolio content editing
 * - No CRM confusion - pure portfolio focus
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import ProfileCard from "@/components/Admin/ProfileCard";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [isLoading, user, router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Loading Admin Panel...</h2>
          <p className="text-[var(--text-secondary)] mt-2">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Clean, focused navigation menu for portfolio management
  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: "🏠",
      description: "Overview & quick actions",
      active: true,
    },
    {
      name: "Personal Info",
      href: "/admin/personal",
      icon: "👤",
      description: "Name, title, contact, summary",
      active: true,
    },
    {
      name: "Work Experience",
      href: "/admin/experience",
      icon: "💼",
      description: "Job history & achievements",
      active: true,
    },
    {
      name: "Education",
      href: "/admin/education",
      icon: "🎓",
      description: "Degrees & certifications",
      active: false,
      comingSoon: true,
    },
    {
      name: "Skills & Tech",
      href: "/admin/skills",
      icon: "�️",
      description: "Programming & technologies",
      active: false,
      comingSoon: true,
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: "�",
      description: "Portfolio projects showcase",
      active: false,
      comingSoon: true,
    },
    {
      name: "Contact Leads",
      href: "/admin/leads",
      icon: "📧",
      description: "People who contacted you",
      active: true,
      highlight: true,
      badge: "3", // Will be dynamic later
    },
    {
      name: "Site Settings",
      href: "/admin/settings",
      icon: "⚙️",
      description: "SEO, metadata, configurations",
      active: false,
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Professional Header Bar */}
      <header className="bg-[var(--card-bg)] shadow-sm border-b border-[var(--border)] fixed w-full top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo & Title */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-muted)] transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo and branding */}
              <div className="flex items-center ml-2">
                <div className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)]/80 p-2.5 rounded-lg mr-3 shadow-md">
                  <span className="text-black font-bold text-lg">AH</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[var(--text-primary)]">Portfolio Admin</h1>
                  <p className="text-sm text-[var(--text-secondary)] hidden sm:block">Content Management System</p>
                </div>
              </div>
            </div>

            {/* Right side - Actions & User menu */}
            <div className="flex items-center space-x-4">
              {/* View Site button */}
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center px-3 py-2 border border-[var(--border)] shadow-sm text-sm font-medium rounded-md text-[var(--text-primary)] bg-[var(--card-bg)] hover:bg-[var(--accent-muted)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Site
              </Link>

              {/* User info and logout */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-[var(--text-primary)]">Ammar Hany</p>
                  <p className="text-sm text-[var(--text-secondary)]">Portfolio Admin</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-r from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/30 rounded-full flex items-center justify-center border-2 border-[var(--accent-primary)]/50">
                  <span className="text-[var(--accent-primary)] font-semibold text-sm">AH</span>
                </div>
                <button onClick={handleLogout} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Elegant Sidebar Navigation */}
        <nav className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transform transition-transform duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-30 w-72 bg-[var(--card-bg)] shadow-xl border-r border-[var(--border)] mt-0`}>
          <div className="flex flex-col h-full pt-6 pb-4 overflow-y-auto">
            {/* Profile Card */}
            <ProfileCard />

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2">
              <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4 px-3">Portfolio Management</div>

              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const isDisabled = !item.active;

                if (isDisabled) {
                  return (
                    <div key={item.name} className="flex items-center px-3 py-3 text-sm font-medium text-[var(--text-secondary)] rounded-lg cursor-not-allowed bg-[var(--accent-muted)]/30 border border-[var(--border)]">
                      <span className="mr-3 text-lg opacity-50">{item.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                          <span className="text-xs bg-[var(--accent-muted)] text-[var(--text-secondary)] px-2 py-1 rounded-full">Soon</span>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">{item.description}</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 shadow-sm"
                        : item.highlight
                        ? "text-green-400 hover:bg-green-500/20 hover:text-green-300 border border-transparent hover:border-green-500/30"
                        : "text-[var(--text-primary)] hover:bg-[var(--accent-muted)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--border)]"
                    }`}>
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={item.highlight ? "font-semibold" : ""}>{item.name}</span>
                        {item.badge && <span className={`text-xs px-2 py-1 rounded-full ${item.highlight ? "bg-green-500/20 text-green-400" : "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]"}`}>{item.badge}</span>}
                      </div>
                      <div className={`text-xs mt-1 ${isActive ? "text-[var(--accent-primary)]/80" : item.highlight ? "text-green-400/80" : "text-[var(--text-secondary)]"}`}>{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Help Section */}
            <div className="px-4 pt-6 border-t border-[var(--border)]">
              <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3 px-3">Need Help?</div>
              <Link href="/admin/help" className="flex items-center px-3 py-3 text-sm font-medium text-[var(--accent-primary)] rounded-lg hover:bg-[var(--accent-primary)]/20 transition-colors">
                <span className="mr-3 text-lg">❓</span>
                <div>
                  <div className="font-medium">How to Use</div>
                  <div className="text-xs text-[var(--accent-primary)]/80 mt-1">Step-by-step guide</div>
                </div>
              </Link>
            </div>
          </div>
        </nav>

        {/* Overlay for mobile */}
        {sidebarOpen && <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity" onClick={() => setSidebarOpen(false)} />}

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen bg-[var(--bg-primary)]">{children}</main>
      </div>
    </div>
  );
}
