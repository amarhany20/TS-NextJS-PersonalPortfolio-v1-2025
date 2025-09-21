"use client";
import SectionHeader from '@/components/UI/SectionHeader';
import AccentBar from '@/components/UI/AccentBar';
import SectionCard from '@/components/UI/SectionCard';
import { useEducation } from '@/hooks/useStaticData';
import { GraduationCap, MapPin, Calendar, Award, Trophy } from 'lucide-react';
import type { Education as EducationType } from '@/temp-data/education';

export default function EducationSection() {
	const education = useEducation();
	if (!education?.length) return (
		<section id="education" className="scroll-mt-8"><SectionHeader title="Education" subtitle="My academic background and achievements" /><div className="flex items-center justify-center py-12"><p className="text-[var(--text-secondary)]">No education data available</p></div></section>
	);
	return (
		<section id="education" className="scroll-mt-8">
			<SectionHeader title="Education" subtitle="My academic background and achievements" />
			<div className="space-y-8">
				{education.map((edu: EducationType, index) => (
					<SectionCard key={edu.id ?? index} hover className="group relative overflow-hidden">
						<AccentBar direction="secondary-to-primary" />
						<div className="relative z-10 pl-6">
							<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2"><GraduationCap size={20} className="text-[var(--accent-secondary)]" /><h3 className="text-xl font-bold text-foreground">{edu.degree}</h3></div>
									<p className="text-[var(--accent-secondary)] font-semibold text-lg mb-2">{edu.institution}</p>
									<div className="flex items-center gap-4 text-[var(--text-secondary)] text-sm mb-2"><div className="flex items-center gap-1"><MapPin size={16} />{edu.location}</div><div className="flex items-center gap-1"><Calendar size={16} />{edu.end ? `${edu.start} - ${edu.end}` : `${edu.start} - Present`}</div></div>
									<div className="flex items-center gap-4 mt-2">
										<div className="flex items-center gap-1"><Award size={16} className="text-[var(--success)]" /><span className="text-[var(--success)] font-medium text-sm">{edu.gpa}</span></div>
										<div className="flex items-center gap-1"><Trophy size={16} className="text-[var(--accent-primary)]" /><span className="text-[var(--accent-primary)] font-medium text-sm">Top Student</span></div>
									</div>
								</div>
								<div className="mt-4 lg:mt-0"><span className={`px-3 py-1 rounded-full text-xs font-medium ${edu.end ? 'bg-[var(--accent-secondary)] text-white' : 'bg-[var(--accent-primary)] text-black'}`}>{edu.end ? 'Completed' : 'Ongoing'}</span></div>
							</div>
							<div className="mb-6"><h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full"></span>Academic Focus</h4>{edu.project && <p className="text-[var(--text-secondary)] text-sm">{edu.project}</p>}</div>
							<div><h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Trophy size={16} className="text-[var(--accent-primary)]" />Key Achievements</h4><ul className="space-y-2">{edu.achievements.map((achievement: string, i: number) => (<li key={i} className="text-[var(--text-secondary)] text-sm flex items-start"><span className="text-[var(--success)] mr-3 mt-1 font-bold">✓</span>{achievement}</li>))}</ul></div>
						</div>
					</SectionCard>
				))}
			</div>
		</section>
	);
}
