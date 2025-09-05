"use client";

import { useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { apiService } from "@/lib/api-client";

type QuickLink = { href: string; icon: string; label?: string };

type IconLib = Record<string, React.ComponentType<{ size?: number; className?: string }>>;
const iconOr = (name?: string) => (Icons as unknown as IconLib)[name || ""] || (Icons as unknown as IconLib)["Link"];

export default function SocialLinks() {
  const [links, setLinks] = useState<QuickLink[] | null>(null);

  useEffect(() => {
    let mounted = true;
    // Load up to 6 links from metadata category "quickLinks"
    apiService
      .getMetadataByCategory("quickLinks")
      .then((res) => {
        if (!mounted) return;
        const obj = res.data as Record<string, unknown>;
        const arr = Object.values(obj).filter((v) => typeof v === "object" && v !== null) as Array<Record<string, unknown>>;
        const cleaned = arr
          .map((v) => ({ href: String(v.href || ""), icon: String(v.icon || ""), label: typeof v.label === "string" ? v.label : undefined }))
          .filter((v) => typeof v.href === "string" && typeof v.icon === "string")
          .slice(0, 6);
        if (cleaned.length) setLinks(cleaned);
      })
      .catch(() => void 0);
    return () => {
      mounted = false;
    };
  }, []);

  const fallback = useMemo<QuickLink[]>(
    () => [
      { href: "https://wa.me/201061888476", icon: "MessageCircle", label: "WhatsApp" },
      { href: "mailto:ammarhanyezeldin@gmail.com", icon: "Mail", label: "Email" },
      { href: "https://github.com/amarhany20", icon: "Github", label: "GitHub" },
      { href: "https://www.linkedin.com/in/ammar-hany/", icon: "Linkedin", label: "LinkedIn" },
      { href: "https://www.youtube.com/@TheChillTechgineer", icon: "Youtube", label: "YouTube" },
    ],
    []
  );

  const data = links && links.length ? links : fallback;

  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-center mb-3">Connect</h3>
      <div className="flex flex-col items-center gap-2">
        {data.map((l, idx) => {
          const Icon = iconOr(l.icon);
          const aria = l.label || "link";
          const isExternal = /^https?:/i.test(l.href) || l.href.startsWith("mailto:") || l.href.startsWith("wa.me") || l.href.startsWith("tel:");
          return (
            <a
              key={`${l.href}-${idx}`}
              href={l.href}
              aria-label={aria}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--accent-muted)] transition-all duration-200 group"
            >
              <Icon size={16} className="text-[var(--text-secondary)] group-hover:scale-110 transition-transform" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
