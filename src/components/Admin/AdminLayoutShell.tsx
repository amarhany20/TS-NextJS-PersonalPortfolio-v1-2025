'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  BriefcaseBusiness,
  GraduationCap,
  Blocks,
  BookOpenCheck,
  Award,
  Quote,
  Wrench,
  Images,
  Inbox,
  Palette,
  Eye,
  UserRound,
  Database,
  Menu,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode, type ComponentType } from 'react';
import type { SessionUser } from '@/server/security/session';
import { ToastProvider } from '@/components/ui/ToastProvider';

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
  { href: '/admin/blogs', label: 'Blog', icon: BookOpenCheck },
  { href: '/admin/media', label: 'Media', icon: Images },
  { href: '/admin/contact', label: 'Contact', icon: Inbox },
  { href: '/admin/certificates', label: 'Certificates', icon: Award },
  { href: '/admin/recommendations', label: 'Testimonials', icon: Quote },
  { href: '/admin/skills', label: 'Skills', icon: Wrench },
  { href: '/admin/settings/profile', label: 'Site Profile', icon: UserRound },
  { href: '/admin/settings/visibility', label: 'Visibility', icon: Eye },
  { href: '/admin/settings/theme', label: 'Theme', icon: Palette },
  { href: '/admin/settings/backup', label: 'Backup & Restore', icon: Database },
];

function getInitials(displayName?: string) {
  if (!displayName) {
    return '?';
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Close mobile sidebar on route change
    setMobileSidebarOpen(false);
  }, [pathname]);

  const initials = useMemo(
    () => getInitials(user.displayName || user.username),
    [user.displayName, user.username],
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--background)] text-foreground">
        <div className="flex min-h-screen">
          {/* Mobile header */}
          <header className="lg:hidden fixed top-0 left-0 w-full bg-[var(--background)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between z-30">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar"
              className="p-2 rounded-md hover:bg-[var(--accent-muted)] transition-colors"
            >
              <Menu size={20} className="text-[var(--text-secondary)]" />
            </button>
            <span className="text-sm font-semibold truncate">Admin Console</span>
            <div className="h-8 w-8 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)] flex-shrink-0">
              {initials}
            </div>
          </header>
          <aside
            className={`fixed top-[56px] left-0 h-[calc(100vh-56px)] w-64 max-w-[85vw] sm:w-72 bg-[var(--card-bg)]/95 border-r border-[var(--border)] z-50 transform transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:self-start lg:translate-x-0 lg:w-60 lg:max-w-none lg:shrink-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} py-4 overflow-y-auto`}
          >
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-[var(--border)]/60">
              <span className="text-lg font-semibold">Admin Menu</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-[var(--accent-muted)] transition-colors"
              >
                <X size={20} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="flex items-center gap-3 px-4 sm:px-6 border-b border-[var(--border)]/60 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-primary)] text-black font-semibold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">
                  {user.displayName || user.username}
                </p>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
                  Admin
                </p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-primary)]/90 text-black shadow'
                        : 'text-[var(--text-secondary)] hover:text-foreground hover:bg-[var(--accent-muted)]'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? 'text-black' : 'text-[var(--accent-secondary)]'}
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="flex-1 flex flex-col pt-[56px] lg:pt-0">
            <div className="border-b border-[var(--border)] bg-[var(--background)]/95 px-3 py-2 flex gap-2 overflow-x-auto lg:hidden scrollbar-hide">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors flex-shrink-0 ${
                      isActive
                        ? 'bg-[var(--accent-primary)] text-black'
                        : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex-1 flex flex-col">
              {mobileSidebarOpen && (
                <div
                  className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-hidden="true"
                />
              )}
              <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 lg:py-8 pt-0 lg:pt-0">
                <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
