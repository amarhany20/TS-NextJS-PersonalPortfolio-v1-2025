"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Folder, Book, Package, Mail } from "lucide-react";
import { useMemo } from "react";

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

  const fallback: NavItem[] = useMemo(
    () => [
      { href: "/", label: "Home", icon: "Home" },
  { href: "/portfolio", label: "Portfolio", icon: "Folder" },
      { href: "/services", label: "Services", icon: "Package" },
      { href: "/blogs", label: "Blogs", icon: "Book" },
  // Contact page removed
    ],
    []
  );

  // Normalize and enforce desired order & labels
  const desiredOrder = [
    { key: "home", label: "Home", href: "/", icon: "Home" },
  { key: "portfolio", label: "Portfolio", href: "/portfolio", icon: "Folder" },
    { key: "blog", label: "Blog", href: "/blogs", icon: "Book" },
    { key: "services", label: "Services", href: "/services", icon: "Package" },
  ];

  const navMap = new Map<string, NavItem>();
  (fallback).forEach((i) => {
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
