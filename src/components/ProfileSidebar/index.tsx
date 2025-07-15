import Image from "next/image";
import { Mail, Linkedin, MapPin, Github, Globe } from "lucide-react";
import { personalInfo, coreSkills, languages, socialLinks } from "@/data/profile";

export default function ProfileSidebar() {
  return (
    <aside className="hidden lg:flex flex-col p-6 bg-[var(--sidebar)] border-r border-[var(--border)] fixed top-0 left-0 h-screen w-[280px] overflow-y-auto z-10">
      {/* Photo */}
      <div className="w-28 h-28 rounded-full border-4 border-[var(--accent-primary)] overflow-hidden shadow-lg mb-4 mx-auto">
        <Image src={personalInfo.photo} alt={personalInfo.displayName} width={112} height={112} className="object-cover w-full h-full" />
      </div>

      {/* Name & Title */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-1">{personalInfo.displayName}</h2>
        <p className="text-md text-[var(--accent-secondary)]">Full-Stack Engineer</p>
      </div>

      {/* Links */}
      <div className="space-y-3 mb-4">
        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors" aria-label="GitHub Profile">
          <Github size={16} />
          <span className="text-sm">GitHub</span>
        </a>
        <a href={socialLinks.email} className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors" aria-label="Email">
          <Mail size={16} />
          <span className="text-sm">{personalInfo.email}</span>
        </a>
        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors" aria-label="LinkedIn Profile">
          <Linkedin size={16} />
          <span className="text-sm">LinkedIn</span>
        </a>
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <MapPin size={16} />
          <span className="text-sm">{personalInfo.location}</span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[var(--border)] mb-4" />

      {/* Core Skills */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--accent-primary)] mb-2">Core Skills</h3>
        <div className="flex flex-wrap gap-2">
          {coreSkills.slice(0, 5).map((skill) => (
            <span key={skill} className="bg-[var(--accent-muted)] text-xs rounded px-2 py-1 text-[var(--foreground)]">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[var(--border)] mb-4" />

      {/* Languages */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[var(--accent-primary)] mb-2">Languages</h3>
        <div className="grid grid-cols-2 gap-2">
          {languages.slice(0, 4).map((lang) => (
            <div key={lang.name}>
              <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                <Globe size={14} />
                <span>{lang.name}</span>
              </div>
              <div className="text-[var(--text-secondary)] text-xs">{lang.level.split(" –")[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[var(--border)] mb-4" />

      {/* GitHub Link */}
      <a
        href={socialLinks.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[var(--accent-muted)] hover:bg-[var(--accent-primary)] hover:text-black text-[var(--foreground)] py-2 px-4 rounded transition-colors mb-4"
        aria-label="View GitHub Profile">
        <Github size={16} />
        <span className="text-sm font-medium">GitHub</span>
      </a>

      {/* Bottom - Copyright */}
      <div className="mt-auto text-center text-xs text-[var(--text-secondary)]">© 2025</div>
    </aside>
  );
}
