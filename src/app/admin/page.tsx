"use client";
import Link from 'next/link';

const modules = [
  { name: 'Personal', href: '/admin/personal', desc: 'Identity & summary' },
  { name: 'Experience', href: '/admin/experience', desc: 'Work history & achievements' },
  { name: 'Education', href: '/admin/education', desc: 'Academic background' },
  { name: 'Skills', href: '/admin/skills', desc: 'Technical skill matrix' },
  { name: 'Certificates', href: '/admin/certificates', desc: 'Professional certifications' },
  { name: 'Services', href: '/admin/services', desc: 'Service offerings' },
  { name: 'Languages', href: '/admin/languages', desc: 'Language proficiency' },
  { name: 'Recommendations', href: '/admin/recommendations', desc: 'Testimonials & endorsements' },
  { name: 'Metadata', href: '/admin/metadata', desc: 'Global site metadata' },
];

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Manage portfolio content, structure & metadata.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map(m => (
          <Link key={m.href} href={m.href} className="group relative border border-border rounded-lg p-5 bg-[var(--card-bg)] hover:bg-[var(--accent-muted)]/60 transition-colors">
            <div className="flex flex-col gap-2">
              <span className="font-semibold tracking-wide">{m.name}</span>
              <span className="text-xs text-[var(--text-secondary)] leading-snug">{m.desc}</span>
            </div>
            <span className="absolute right-3 top-3 text-[10px] uppercase text-[var(--accent-primary)] group-hover:text-[var(--accent-secondary)] transition-colors">Open</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
