"use client";

import { useMemo } from "react";
import * as Icons from "lucide-react";

type QuickLink = { href: string; icon: string; label?: string };

type IconLib = Record<string, React.ComponentType<{ size?: number; className?: string }>>;
const iconOr = (name?: string) => (Icons as unknown as IconLib)[name || ""] || (Icons as unknown as IconLib)["Link"];

export default function SocialLinks() {

  const fallback = useMemo<QuickLink[]>(
    () => [
      { href: "https://wa.me/905395775990", icon: "MessageCircle", label: "WhatsApp" },
      { href: "mailto:ammarhanyezeldin@gmail.com", icon: "Mail", label: "Email" },
      { href: "https://github.com/amarhany20", icon: "Github", label: "GitHub" },
      { href: "https://www.linkedin.com/in/ammar-hany/", icon: "Linkedin", label: "LinkedIn" },
      { href: "https://www.youtube.com/@TheChillTechgineer", icon: "Youtube", label: "YouTube" },
    ],
    []
  );

  const data = fallback;

  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-center mb-3">Connect</h3>
      <div className="flex flex-col items-center gap-2">
        {data.map((l, idx) => {
          const Icon = iconOr(l.icon);
          const aria = l.label || "link";
          const isExternal = /^https?:/i.test(l.href) || l.href.startsWith("mailto:") || l.href.startsWith("wa.me") || l.href.startsWith("tel:");
          const colorMap: Record<string,string> = {
            WhatsApp: '#25D366',
            Email: '#ffb400',
            GitHub: '#fff',
            LinkedIn: '#0A66C2',
            YouTube: '#FF0000'
          };
          const brand = colorMap[l.label || ''] || 'var(--text-secondary)';
          return (
            <a
              key={`${l.href}-${idx}`}
              href={l.href}
              aria-label={aria}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
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
