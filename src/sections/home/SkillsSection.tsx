"use client";
import SectionHeader from '@/components/UI/SectionHeader';
import SectionCard from '@/components/UI/SectionCard';
import type { SkillGroupDisplay } from '@/types/skill';

interface SkillsSectionProps {
  groups?: SkillGroupDisplay[];
}

const SORT_ORDER = ['backend','frontend','databases','ai-cv','cloud-devops','languages','soft-skills'];

export default function SkillsSection({ groups }: SkillsSectionProps) {
	const ordered = (groups ?? []).slice().sort((a,b)=> SORT_ORDER.indexOf(a.id) - SORT_ORDER.indexOf(b.id));
	return (
		<section id="skills" className="scroll-mt-8">
			<SectionHeader title="Skills" subtitle="Technologies, tools & strengths" />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 items-start content-start">
				{ordered.map(g => <SkillGroupCard key={g.id} group={g} />)}
			</div>
		</section>
	);
}

function SkillGroupCard({ group }: { group: SkillGroupDisplay }) {
	return (
		<SectionCard className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
			<div className="mb-4 pr-4">
				<h3 className="text-base md:text-lg font-semibold tracking-wide uppercase text-[var(--text-secondary)]">{group.title}</h3>
				{group.summary && <p className="mt-1 text-sm md:text-sm leading-relaxed text-[var(--text-muted)]">{group.summary}</p>}
			</div>
			<ul className="flex flex-wrap mt-auto">
				{group.skills.map(s => (
					<li key={s.name} className="mr-1 mb-1 rounded-md bg-[var(--panel)] px-3 py-2 text-sm font-medium text-[var(--foreground)]">
						{s.name}
					</li>
				))}
			</ul>
		</SectionCard>
	);
}
