"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, GraduationCap, Award, Quote, Settings, Folder, BookOpen, Package, Mail, MessageCircle, Github, Linkedin, Youtube } from "lucide-react";
import { socialLinks } from "@/data/profile";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/experience", icon: Briefcase, label: "Experience" },
  { href: "/education", icon: GraduationCap, label: "Education" },
  { href: "/certificates", icon: Award, label: "Certificates" },
  { href: "/recommendations", icon: Quote, label: "Recommendations" },
  { href: "/skills", icon: Settings, label: "Skills" },
  { href: "/projects", icon: Folder, label: "Projects" },
  { href: "/blogs", icon: BookOpen, label: "Blogs" },
  { href: "/services", icon: Package, label: "Services" },
  { href: "/contact", icon: Mail, label: "Contact" },
];

export default function NavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col justify-between items-center p-4 bg-[var(--sidebar)] border-l border-[var(--border)] fixed top-0 right-0 h-screen w-[100px] overflow-y-auto z-10">
      {/* Main Navigation */}
      <nav>
        <ul className="flex flex-col gap-3">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href === "/home" && pathname === "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]
                    ${isActive ? "bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-black shadow-lg shadow-[var(--accent-primary)]/25" : "text-[var(--text-secondary)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent-primary)] hover:scale-110"}
                  `}
                  aria-label={label}>
                  <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />

                  {/* Tooltip */}
                  <div className="absolute right-full mr-3 px-2 py-1 bg-[var(--card-bg)] text-[var(--foreground)] text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap border border-[var(--border)] shadow-lg">
                    {label}
                    <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-[var(--border)]"></div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent my-6"></div>

      {/* Social / Contact Links */}
      <div className="flex flex-col gap-3">
        <a
          href={socialLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-10 h-10 rounded-full text-[#25D366] hover:bg-[var(--accent-muted)] hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
          aria-label="WhatsApp">
          <MessageCircle size={18} className="transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute right-full mr-3 px-2 py-1 bg-[var(--card-bg)] text-[var(--foreground)] text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap border border-[var(--border)] shadow-lg">
            WhatsApp
            <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-[var(--border)]"></div>
          </div>
        </a>
        <a
          href={socialLinks.email}
          className="group relative flex items-center justify-center w-10 h-10 rounded-full text-[var(--accent-secondary)] hover:bg-[var(--accent-muted)] hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
          aria-label="Email">
          <Mail size={18} className="transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute right-full mr-3 px-2 py-1 bg-[var(--card-bg)] text-[var(--foreground)] text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap border border-[var(--border)] shadow-lg">
            Email
            <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-[var(--border)]"></div>
          </div>
        </a>
        <a
          href={socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-10 h-10 rounded-full text-white hover:bg-[var(--accent-muted)] hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
          aria-label="GitHub">
          <Github size={18} className="transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute right-full mr-3 px-2 py-1 bg-[var(--card-bg)] text-[var(--foreground)] text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap border border-[var(--border)] shadow-lg">
            GitHub
            <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-[var(--border)]"></div>
          </div>
        </a>
        <a
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-10 h-10 rounded-full text-[#0A66C2] hover:bg-[var(--accent-muted)] hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
          aria-label="LinkedIn">
          <Linkedin size={18} className="transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute right-full mr-3 px-2 py-1 bg-[var(--card-bg)] text-[var(--foreground)] text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap border border-[var(--border)] shadow-lg">
            LinkedIn
            <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-[var(--border)]"></div>
          </div>
        </a>
        <a
          href={socialLinks.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-10 h-10 rounded-full text-[#FF0000] hover:bg-[var(--accent-muted)] hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
          aria-label="YouTube">
          <Youtube size={18} className="transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute right-full mr-3 px-2 py-1 bg-[var(--card-bg)] text-[var(--foreground)] text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap border border-[var(--border)] shadow-lg">
            YouTube
            <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-[var(--border)]"></div>
          </div>
        </a>
      </div>
    </aside>
  );
}
