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
  ChevronLeft,
  ChevronRight,
  LogOut,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode, type ComponentType } from 'react';
import type { SessionUser } from '@/server/security/session';
import type { ProfileInfo } from '@/types/settings';
import { ToastProvider } from '@/components/ui/ToastProvider';

interface AdminLayoutShellProps {
  user: SessionUser;
  profile?: ProfileInfo;
  children: ReactNode;
}

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  category: 'overview' | 'content' | 'career' | 'system';
}

const NAV_ITEMS: NavItem[] = [
  // Overview
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'overview' },

  // Content Management
  { href: '/admin/portfolio', label: 'Portfolio', icon: FolderKanban, category: 'content' },
  { href: '/admin/blogs', label: 'Blog Posts', icon: BookOpenCheck, category: 'content' },
  { href: '/admin/services', label: 'Services', icon: Blocks, category: 'content' },
  { href: '/admin/media', label: 'Media Library', icon: Images, category: 'content' },

  // Career & Experience
  { href: '/admin/experience', label: 'Experience', icon: BriefcaseBusiness, category: 'career' },
  { href: '/admin/education', label: 'Education', icon: GraduationCap, category: 'career' },
  { href: '/admin/skills', label: 'Skills', icon: Wrench, category: 'career' },
  { href: '/admin/certificates', label: 'Certificates', icon: Award, category: 'career' },
  { href: '/admin/recommendations', label: 'Testimonials', icon: Quote, category: 'career' },
  { href: '/admin/contact', label: 'Contact Submissions', icon: Inbox, category: 'career' },

  // System & Settings
  { href: '/admin/settings/profile', label: 'Site Profile', icon: UserRound, category: 'system' },
  { href: '/admin/settings/visibility', label: 'Visibility', icon: Eye, category: 'system' },
  { href: '/admin/settings/theme', label: 'Theme Gallery', icon: Palette, category: 'system' },
  { href: '/admin/settings/backup', label: 'Backup & Restore', icon: Database, category: 'system' },
];

function getInitials(displayName?: string) {
  if (!displayName) return '?';
  const matches = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase())
    .filter(Boolean);

  if (!matches.length) return displayName[0]?.toUpperCase() ?? '?';
  return matches.slice(0, 2).join('');
}

export function AdminLayoutShell({ user, profile, children }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load and persist sidebar collapsed preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next));
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  };

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const initials = useMemo(
    () => getInitials(user.displayName || user.username),
    [user.displayName, user.username],
  );

  const avatarPhoto = profile?.photoUrl || '/2024 Ammar Personal Photo.jpg';

  const overviewItems = useMemo(() => NAV_ITEMS.filter((i) => i.category === 'overview'), []);
  const contentItems = useMemo(() => NAV_ITEMS.filter((i) => i.category === 'content'), []);
  const careerItems = useMemo(() => NAV_ITEMS.filter((i) => i.category === 'career'), []);
  const systemItems = useMemo(() => NAV_ITEMS.filter((i) => i.category === 'system'), []);

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  const renderNavGroup = (items: NavItem[], title?: string) => (
    <div className="space-y-1">
      {title && !isCollapsed && (
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] opacity-70 mb-1.5">
          {title}
        </p>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== '/admin/dashboard' && item.href !== '/admin' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            title={isCollapsed ? item.label : undefined}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 relative ${
              isActive
                ? 'bg-[var(--accent-primary)] text-[var(--accent-contrast,#000000)] shadow-sm font-bold'
                : 'text-[var(--text-secondary)] hover:text-foreground hover:bg-[var(--accent-muted)]'
            } ${isCollapsed ? 'justify-center px-2' : ''}`}
          >
            <Icon
              size={18}
              className={`shrink-0 transition-colors ${
                isActive ? 'text-[var(--accent-contrast,#000000)]' : 'text-[var(--text-secondary)] group-hover:text-foreground'
              }`}
            />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--background)] text-foreground flex">
        {/* Desktop Left Sidebar (Literal Left - Theme Synced) */}
        <aside
          className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 bg-[var(--card-bg)] border-r border-[var(--border)] z-40 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Sidebar Header & User Card */}
          <div className="p-4 border-b border-[var(--border)]/60 flex items-center justify-between gap-2 shrink-0 h-16 bg-[var(--card-bg)]">
            {!isCollapsed && (
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden bg-[var(--accent-primary)] text-black font-bold text-xs shrink-0 shadow border border-[var(--border)]">
                  {avatarPhoto ? (
                    <img
                      src={avatarPhoto}
                      alt={user.displayName || user.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate leading-tight">
                    {user.displayName || user.username}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-medium">
                    Admin Console
                  </p>
                </div>
              </div>
            )}

            {isCollapsed && (
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full overflow-hidden bg-[var(--accent-primary)] text-black font-bold text-xs shadow border border-[var(--border)]">
                {avatarPhoto ? (
                  <img
                    src={avatarPhoto}
                    alt={user.displayName || user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
            )}

            <button
              onClick={toggleSidebar}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-foreground hover:bg-[var(--accent-muted)] transition-colors shrink-0 hidden lg:flex"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
            {renderNavGroup(overviewItems, 'Overview')}
            {renderNavGroup(contentItems, 'Content & Media')}
            {renderNavGroup(careerItems, 'Career & Inbox')}
            {renderNavGroup(systemItems, 'System Settings')}
          </nav>

          {/* Sidebar Footer: View Live Site & Logout */}
          <div className="p-3 border-t border-[var(--border)]/60 shrink-0 space-y-1 bg-[var(--card-bg)]">
            <Link
              href="/home"
              target="_blank"
              rel="noopener noreferrer"
              title={isCollapsed ? 'View Live Site' : undefined}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--accent-primary)] hover:bg-[var(--accent-muted)] transition-colors ${
                isCollapsed ? 'justify-center px-2' : ''
              }`}
            >
              <Globe size={18} className="shrink-0" />
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>View Live Site</span>
                  <ExternalLink size={14} className="opacity-70" />
                </div>
              )}
            </Link>

            <button
              onClick={handleLogout}
              title={isCollapsed ? 'Sign out' : undefined}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors ${
                isCollapsed ? 'justify-center px-2' : ''
              }`}
            >
              <LogOut size={18} className="shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Header (< lg) */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--card-bg)] border-b border-[var(--border)] px-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-foreground hover:bg-[var(--accent-muted)] transition-colors"
            >
              <Menu size={22} />
            </button>
            <span className="text-sm font-bold tracking-tight text-foreground">Admin Console</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/home"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[var(--accent-primary)] hover:bg-[var(--accent-muted)] transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="View Live Site"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">Live Site</span>
            </Link>

            <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-[var(--accent-primary)] text-black font-bold text-xs shadow border border-[var(--border)]">
              {avatarPhoto ? (
                <img
                  src={avatarPhoto}
                  alt={user.displayName || user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
          </div>
        </header>

        {/* Mobile Drawer Backdrop (< lg) */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Slide-Over Drawer (< lg) */}
        <aside
          className={`fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-[var(--card-bg)] border-r border-[var(--border)] z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden bg-[var(--accent-primary)] text-black font-bold text-xs shrink-0 shadow border border-[var(--border)]">
                {avatarPhoto ? (
                  <img
                    src={avatarPhoto}
                    alt={user.displayName || user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-foreground">{user.displayName || user.username}</p>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Admin</p>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-foreground hover:bg-[var(--accent-muted)]"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-5">
            {renderNavGroup(overviewItems, 'Overview')}
            {renderNavGroup(contentItems, 'Content & Media')}
            {renderNavGroup(careerItems, 'Career & Inbox')}
            {renderNavGroup(systemItems, 'System Settings')}
          </nav>

          <div className="p-4 border-t border-[var(--border)] space-y-2">
            <Link
              href="/home"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--accent-primary)] hover:bg-[var(--accent-muted)] transition-colors"
            >
              <Globe size={18} />
              <span className="flex-1">View Live Site</span>
              <ExternalLink size={14} className="opacity-70" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Body */}
        <div
          className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out pt-14 lg:pt-0 ${
            isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
          }`}
        >
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
