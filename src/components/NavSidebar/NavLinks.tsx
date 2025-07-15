"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, GraduationCap, Award, Quote, Settings, Folder, Book, Package, Mail } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/experience", label: "Experience", icon: Briefcase },
  { href: "/education", label: "Education", icon: GraduationCap },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/recommendations", label: "Recommendations", icon: Quote },
  { href: "/skills", label: "Skills", icon: Settings },
  { href: "/projects", label: "Projects", icon: Folder },
  { href: "/blogs", label: "Blogs", icon: Book },
  { href: "/services", label: "Services", icon: Package },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 mt-8">
      {navLinks.map((link) => {
        const IconComponent = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            href={link.href}
            key={link.href}
            className={`
              flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-xl group transition-all duration-300 relative
              ${isActive ? "bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-black shadow-lg" : "hover:bg-[var(--accent-muted)] text-[var(--text-secondary)]"}
            `}
            aria-label={link.label}>
            <IconComponent
              size={22}
              className={`
                transition-all duration-300
                ${isActive ? "text-black" : "text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] group-hover:scale-110"}
              `}
            />
            <span
              className={`
              text-xs font-medium transition-all duration-300
              ${isActive ? "text-black" : "text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)]"}
            `}>
              {link.label}
            </span>

            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-[var(--card-bg)] text-[var(--foreground)] px-3 py-2 rounded-lg text-sm font-medium shadow-lg border border-[var(--border)]">{link.label}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
