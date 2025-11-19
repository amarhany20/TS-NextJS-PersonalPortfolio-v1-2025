"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  BriefcaseBusiness,
  GraduationCap,
  Blocks,
  Award,
  Quote,
  Wrench,
} from 'lucide-react';
import { useMemo, type ReactNode, type ComponentType } from 'react';
import type { SessionUser } from '@/server/security/session';

interface AdminLayoutShellProps {
  user: SessionUser;
  children: ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/portfolio', label: 'Portfolio', icon: FolderKanban },
  { href: '/admin/experience', label: 'Experience', icon: BriefcaseBusiness },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/services', label: 'Services', icon: Blocks },
  { href: '/admin/certificates', label: 'Certificates', icon: Award },
  { href: '/admin/recommendations', label: 'Testimonials', icon: Quote },
  { href: '/admin/skills', label: 'Skills', icon: Wrench },
];

function getInitials(displayName?: string) {
  if (!displayName) {
    return "?";
  }

  const matches = displayName
  .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase())
    .filter(Boolean);

  if (!matches.length) {
  return displayName[0]?.toUpperCase() ?? '?';
  }

  return matches.slice(0, 2).join('');
}

export function AdminLayoutShell({ user, children }: AdminLayoutShellProps) {
  const pathname = usePathname();

  const initials = useMemo(() => getInitials(user.displayName || user.username), [user.displayName, user.username]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex lg:w-60 xl:w-72 flex-col border-r border-[var(--border)] bg-[var(--card-bg)]/40">
          <div className="flex items-center gap-2 px-6 py-6 border-b border-[var(--border)]/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-primary)] text-black font-semibold">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold">{user.displayName || user.username}</p>
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">Admin</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-[var(--accent-primary)]/90 text-black shadow"
                      : "text-[var(--text-secondary)] hover:text-foreground hover:bg-[var(--accent-muted)]"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-black" : "text-[var(--accent-secondary)]"} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-6 py-4 border-t border-[var(--border)]/60 text-xs text-[var(--text-secondary)]">
            <p className="font-medium text-foreground">Quick tip</p>
            <p>Use the navigation to manage portfolio content and supporting copy.</p>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase text-[var(--text-secondary)] tracking-wide">Admin Console</span>
              <span className="text-lg font-semibold">{user.displayName || user.username}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex rounded-full bg-[var(--accent-muted)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                {user.email}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)]">
                {initials}
              </div>
            </div>
          </header>

          <div className="lg:hidden border-b border-[var(--border)] bg-[var(--background)]/95 px-3 py-2 flex gap-2 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-primary)] text-black"
                      : "border border-[var(--border)] text-[var(--text-secondary)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-10 py-6 md:py-8">
            <div className="mx-auto w-full max-w-5xl space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
