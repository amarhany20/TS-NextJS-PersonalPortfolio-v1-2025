"use client";
import React, { useMemo, useState } from 'react';
import type { Experience } from '@/types/experience';
import SectionHeader from '@/components/UI/SectionHeader';
import AccentBar from '@/components/UI/AccentBar';
import SectionCard from '@/components/UI/SectionCard';
import { Briefcase, MapPin, Calendar, Star, ChevronDown, ExternalLink } from 'lucide-react';

interface ExperienceSectionProps {
  items?: Experience[];
}

export default function ExperienceSection({ items }: ExperienceSectionProps) {
	const expData = useMemo(() => items?.filter(Boolean) ?? [], [items]);
	if (!expData.length) return (
		<section id="experience" className="scroll-mt-8">
			<SectionHeader title="Experience" subtitle="My professional journey and key accomplishments" />
			<div className="flex items-center justify-center py-12"><p className="text-[var(--text-secondary)]">No experience data</p></div>
		</section>
	);
	return (
		<section id="experience" className="scroll-mt-8">
			<SectionHeader title="Experience" subtitle="My professional journey and key accomplishments" />
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-5 xl:gap-7">
				{expData.map(exp => (
					<ExperienceItem key={exp.id} exp={exp} />
				))}
			</div>
		</section>
	);
}

interface ExperienceItemProps { exp: Experience }

function ExperienceItem({ exp }: ExperienceItemProps) {
	const [open, setOpen] = useState(false);

	const duration = exp.end ? `${exp.start} - ${exp.end}` : `${exp.start} - Present`;
	const truncatedDescription = exp.impact.length > 180 ? exp.impact.slice(0, 180) + '…' : exp.impact;

	return (
		<SectionCard hover className={`group relative overflow-hidden transition-colors ${open ? 'ring-1 ring-[var(--accent-primary)]/30' : ''}`}>
			<AccentBar direction="primary-to-secondary" />
			<div className="relative z-10 pl-5 sm:pl-6">
				{/* Header Row */}
				<div className="flex flex-col gap-4 sm:gap-3 md:flex-row md:items-start md:justify-between mb-4 md:mb-5">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1.5">
							<Briefcase size={18} className="text-[var(--accent-primary)]" />
							<h3 className="text-lg md:text-xl font-bold text-foreground leading-snug">
								{exp.title}
							</h3>
						</div>
						<p className="text-[var(--accent-primary)] font-semibold text-sm md:text-base mb-1.5 flex flex-wrap items-center gap-2">
							<span>{exp.company}</span>
							{exp.companyUrl && (
								<a
									href={exp.companyUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-[var(--accent-secondary)] hover:text-[var(--accent-primary)] text-xs font-medium underline decoration-dotted"
								>
									<ExternalLink size={14} /> Visit
								</a>
							)}
						</p>
							<div className="flex flex-wrap gap-x-4 gap-y-1 text-[var(--text-secondary)] text-xs md:text-sm">
								<div className="flex items-center gap-1"><MapPin size={14} />{exp.location}</div>
								<div className="flex items-center gap-1"><Calendar size={14} />{duration}</div>
							</div>
					</div>
								<div className="flex items-center justify-end gap-3">
									<span className={`px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide ${exp.present ? 'bg-[var(--accent-primary)] text-black' : 'bg-[var(--accent-muted)] text-[var(--text-secondary)]'}`}>{exp.present ? 'Current' : 'Past'}</span>
									<button
										onClick={() => setOpen(o => !o)}
										aria-expanded={open}
										aria-controls={`exp-details-${exp.id}`}
										className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/50"
									>
										<span>Details</span>
										<ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
									</button>
								</div>
				</div>

				{/* Overview */}
				<div className="mb-3 md:mb-4">
					<h4 className="text-[11px] md:text-xs font-semibold tracking-wide text-foreground mb-2 flex items-center gap-1.5">
						<span className="w-1.5 h-1.5 bg-[var(--accent-secondary)] rounded-full"></span>
						Role Overview
					</h4>
					<p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-4 md:line-clamp-none">
							{open ? exp.impact : truncatedDescription}
					</p>
				</div>

				{/* Collapsible Details */}
				<div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} overflow-hidden`} id={`exp-details-${exp.id}`}>
					<div className="overflow-hidden">
						{/* Achievements */}
							{exp.achievements.length ? (
							<div className="mb-5 md:mb-6">
								<h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
									<Star size={16} className="text-[var(--accent-primary)]" />
									Key Achievements
								</h4>
								<ul className="space-y-2">
									{exp.achievements.map((achievement: string, i: number) => (
										<li key={i} className="text-[var(--text-secondary)] text-sm flex items-start">
											<span className="text-[var(--success)] mr-3 mt-1 font-bold">✓</span>
											{achievement}
										</li>
									))}
								</ul>
							</div>
						) : null}

						{/* Technologies */}
							{exp.skills.length ? (
							<div>
								<h4 className="text-sm font-semibold text-foreground mb-3">Technologies Used</h4>
								<div className="flex flex-wrap">
									{exp.skills.map((skill: string) => (
										<span
											key={skill}
											className="px-3 py-1 mr-1 mb-1 bg-gradient-to-r from-[var(--accent-muted)] to-[var(--accent-muted)] hover:from-[var(--accent-primary)] hover:to-[var(--accent-secondary)] hover:text-black text-[var(--text-secondary)] text-[13px] rounded-full font-medium transition-all duration-300 cursor-default"
										>
											{skill}
										</span>
									))}
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</SectionCard>
	);
}
