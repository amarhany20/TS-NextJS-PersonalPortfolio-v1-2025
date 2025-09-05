"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Folder, Book, Package, Mail } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiService } from "@/lib/api-client";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Home,
  Folder,
  Book,
  Package,
  Mail,
};

type NavItem = { href: string; label: string; icon?: string };

export default function NavLinks() {
  const pathname = usePathname();
  const [items, setItems] = useState<NavItem[] | null>(null);

  useEffect(() => {
    let mounted = true;
    apiService
      .getMetadataByCategory("navigation")
      .then((res) => {
        if (!mounted) return;
        const data = res.data as Record<string, unknown>;
        // Expecting keys like nav_home, nav_projects etc. with { href, label, icon }
        const isRecord = (val: unknown): val is Record<string, unknown> => typeof val === "object" && val !== null;
        const isNavItem = (v: unknown): v is NavItem => {
          if (!isRecord(v)) return false;
          const href = v.href;
          const label = v.label;
          const icon = v.icon;
          return typeof href === "string" && typeof label === "string" && (icon === undefined || typeof icon === "string");
        };
        const entries: NavItem[] = Object.values(data)
          .map((v) => (typeof v === "string" ? null : (v as unknown)))
          .filter((v): v is NavItem => isNavItem(v));
        if (entries.length) setItems(entries);
      })
      .catch(() => void 0);
    return () => {
      mounted = false;
    };
  }, []);

  const fallback: NavItem[] = useMemo(
    () => [
      { href: "/", label: "Home", icon: "Home" },
      { href: "/projects", label: "Projects", icon: "Folder" },
      { href: "/services", label: "Services", icon: "Package" },
      { href: "/blogs", label: "Blogs", icon: "Book" },
      { href: "/contact", label: "Contact", icon: "Mail" },
    ],
    []
  );

  // Normalize and enforce desired order & labels
  const desiredOrder = [
    { key: "home", label: "Home", href: "/", icon: "Home" },
    { key: "portfolio", label: "Portfolio", href: "/projects", icon: "Folder" },
    { key: "blog", label: "Blog", href: "/blogs", icon: "Book" },
    { key: "services", label: "Services", href: "/services", icon: "Package" },
    { key: "contact", label: "Contact", href: "/contact", icon: "Mail" },
  ];

  const navMap = new Map<string, NavItem>();
  (items && items.length ? items : fallback).forEach((i) => {
    const key = i.href === "/" ? "home" : i.href.replace(/^\//, "");
    navMap.set(key, i);
  });

  const navLinks: NavItem[] = desiredOrder.map((d) => {
    const found = navMap.get(d.key);
    return {
      href: found?.href || d.href,
      label: d.label,
      icon: found?.icon || d.icon,
    };
  });

  return (
    <nav className="space-y-1">
      <h3 className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-center mb-3">Navigation</h3>
      {navLinks.map((link) => {
        const IconComponent = iconMap[link.icon || ""] || Home;
        const isActive = pathname === link.href;

        return (
          <Link
            href={link.href}
            key={link.href}
            className={`
              flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-lg group transition-all duration-300 relative
              ${isActive ? "bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-black shadow-lg" : "hover:bg-[var(--accent-muted)] text-[var(--text-secondary)] hover:transform hover:scale-105"}
            `}
            aria-label={link.label}>
            <IconComponent
              size={18}
              className={`
                transition-all duration-300
                ${isActive ? "text-black" : "text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] group-hover:scale-110"}
              `}
            />
            <span
              className={`
              text-[10px] font-medium transition-all duration-300 text-center leading-tight
              ${isActive ? "text-black" : "text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)]"}
            `}>
              {link.label}
            </span>

            {/* Active indicator */}
            {isActive && <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[var(--accent-primary)] rounded-full shadow-lg" />}
          </Link>
        );
      })}
    </nav>
  );
}
