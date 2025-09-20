"use client";
import SectionHeader from '@/components/UI/SectionHeader';
import SectionCard from '@/components/UI/SectionCard';
import { skillGroups } from '@/temp-data/skills';
import { SkillIcon } from '@/components/UI/SkillIcon';

export default function SkillsSection() {
	const order = ['backend','frontend','databases','ai-cv','cloud-devops','languages','soft-skills'];
	const ordered = skillGroups.slice().sort((a,b)=> order.indexOf(a.id)-order.indexOf(b.id));
	return (
		<section id="skills" className="scroll-mt-8">
			<SectionHeader title="Skills" subtitle="Technologies, tools & strengths" />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 items-start content-start">
				{ordered.map(g => <SkillGroupCard key={g.id} group={g} />)}
			</div>
		</section>
	);
}

function SkillGroupCard({ group }: { group: { id: string; title: string; summary?: string; skills: { name: string; icon?: string }[] } }) {
	return (
		<SectionCard className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
			<div className="mb-4 pr-4">
				<h3 className="text-base md:text-lg font-semibold tracking-wide uppercase text-[var(--text-secondary)]">{group.title}</h3>
				{group.summary && <p className="mt-1 text-sm md:text-sm leading-relaxed text-[var(--text-muted)]">{group.summary}</p>}
			</div>
			<ul className="flex flex-wrap mt-auto">
				{group.skills.map(s => (
					<li key={s.name} className="group select-none inline-flex items-center gap-2 mr-1 mb-1 rounded-md border border-[color-mix(in_srgb,var(--border),transparent_40%)] bg-[linear-gradient(var(--panel),var(--panel-alt))] px-3 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/15 hover:shadow transition-colors">
						<SkillIcon name={s.name} icon={s.icon} />
						<span>{s.name}</span>
					</li>
				))}
			</ul>
		</SectionCard>
	);
}
