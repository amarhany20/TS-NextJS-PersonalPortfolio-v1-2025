"use client";

import SectionHeader from "@/components/UI/SectionHeader";
import SectionCard from "@/components/UI/SectionCard";
import { skillGroups } from "@/temp-data/skills";
import { SkillIcon } from "@/components/UI/SkillIcon";

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-8">
      <SectionHeader title="Skills" subtitle="Technologies, tools & strengths" />
      {/* Two-column row-first grid with custom ordering */}
      {(() => {
        const order = [
          'backend',
          'frontend',
          'databases',
          'ai-cv',
          'cloud-devops',
          'languages',
          'soft-skills'
        ];
        const ordered = skillGroups.slice().sort((a,b)=> order.indexOf(a.id)-order.indexOf(b.id));
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
            {ordered.map(g => <SkillGroupCard key={g.id} group={g} />)}
          </div>
        );
      })()}
    </section>
  );
}

function SkillGroupCard({ group }: { group: { id: string; title: string; summary?: string; skills: { name: string; icon?: string }[] } }) {
  return (
    <SectionCard className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 pr-4">
        <h3 className="text-[0.85rem] md:text-sm font-semibold tracking-wide uppercase text-[var(--text-secondary)]">{group.title}</h3>
        {group.summary && <p className="mt-1 text-[0.70rem] md:text-[0.72rem] leading-relaxed text-[var(--text-muted)]">{group.summary}</p>}
      </div>
      <ul className="flex flex-wrap gap-2 mt-auto">
        {group.skills.map(s => (
          <li key={s.name} className="group select-none inline-flex items-center gap-1.5 rounded-md border border-[color-mix(in_srgb,var(--border),transparent_40%)] bg-[linear-gradient(var(--panel),var(--panel-alt))] px-3 py-1.5 text-[0.70rem] md:text-[0.75rem] font-medium text-[var(--foreground)] shadow-sm hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/15 hover:shadow transition-colors">
            <SkillIcon name={s.name} icon={s.icon} />
            <span>{s.name}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

// Simple icon derivation fallback if not provided in data
// (icon derivation handled in SkillIcon component)
