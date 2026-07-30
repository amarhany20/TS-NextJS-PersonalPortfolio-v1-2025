'use client';

import { useMemo, type ComponentType } from 'react';
import * as Icons from 'lucide-react';
import type { LinkItem } from '@/types/settings';

type IconComponent = ComponentType<{ size?: number; className?: string }>;
type IconLibrary = Record<string, IconComponent>;

const iconOr = (name?: string): IconComponent =>
  (Icons as unknown as IconLibrary)[name || ''] || (Icons as unknown as IconLibrary)['Link'];

const ICON_HINTS: Array<{ pattern: RegExp; icon: string }> = [
  { pattern: /github/i, icon: 'Github' },
  { pattern: /linkedin/i, icon: 'Linkedin' },
  { pattern: /youtube|video/i, icon: 'Youtube' },
  { pattern: /whatsapp|wa\.me/i, icon: 'MessageCircle' },
  { pattern: /mail|email/i, icon: 'Mail' },
  { pattern: /medium|blog/i, icon: 'PenSquare' },
  { pattern: /twitter|x\.com/i, icon: 'Twitter' },
  { pattern: /instagram/i, icon: 'Instagram' },
  { pattern: /facebook/i, icon: 'Facebook' },
  { pattern: /dribbble/i, icon: 'Dribbble' },
];

const COLOR_HINTS: Record<string, string> = {
  github: '#fff',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  whatsapp: '#25D366',
  email: '#ffb400',
  twitter: '#1DA1F2',
  x: '#fff',
};

interface SocialLinksProps {
  links: LinkItem[];
}

function guessIconName(link: LinkItem): string {
  const label = link.label ?? '';
  const href = link.href ?? '';
  for (const hint of ICON_HINTS) {
    if (hint.pattern.test(label) || hint.pattern.test(href)) {
      return hint.icon;
    }
  }
  if (/^mailto:/i.test(href)) return 'Mail';
  if (/^tel:/i.test(href)) return 'Phone';
  return 'Link';
}

function resolveBrandColor(label?: string): string {
  if (!label) return 'var(--text-secondary)';
  const key = label.toLowerCase();
  if (COLOR_HINTS[key]) return COLOR_HINTS[key];
  if (key.includes('github')) return COLOR_HINTS.github;
  if (key.includes('linkedin')) return COLOR_HINTS.linkedin;
  if (key.includes('youtube')) return COLOR_HINTS.youtube;
  if (key.includes('whatsapp')) return COLOR_HINTS.whatsapp;
  if (key.includes('mail')) return COLOR_HINTS.email;
  if (key.includes('twitter') || key === 'x') return COLOR_HINTS.twitter;
  return 'var(--text-secondary)';
}

export default function SocialLinks({ links }: SocialLinksProps) {
  const data = useMemo(() => links.filter((link) => Boolean(link?.href)), [links]);

  if (!data.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-center mb-3">
        Connect
      </h3>
      <div className="flex flex-col items-center gap-2">
        {data.map((link) => {
          const iconName = guessIconName(link);
          const Icon = iconOr(iconName);
          const aria = link.label || 'link';
          const href = link.href;
          const isExternal =
            /^https?:/i.test(href) ||
            href.startsWith('mailto:') ||
            href.includes('wa.me') ||
            href.startsWith('tel:');
          const brand = resolveBrandColor(link.label);

          return (
            <a
              key={href}
              href={href}
              aria-label={aria}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--accent-muted)] transition-all duration-200 group"
            >
              <span style={{ color: brand }} className="group-hover:scale-110 transition-transform">
                <Icon size={16} />
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
