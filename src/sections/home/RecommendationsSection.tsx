import SectionHeader from '@/components/UI/SectionHeader';
import SectionCard from '@/components/UI/SectionCard';
import { recommendations as loadRecommendations } from '@/temp-data/loaders/recommendationsLoader';
import { formatMonthYear } from '@/utils/helpers';
import { Linkedin, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function formatDisplayDate(value: string | Date): string {
	if (!value) return '';
	if (typeof value !== 'string') return formatMonthYear(value.toString());
	if (/present/i.test(value)) return 'Present';
	return formatMonthYear(value);
}

export default async function RecommendationsSection() {
	const recommendations = await loadRecommendations();
	return (
		<section id="recommendations" className="scroll-mt-8">
			<SectionHeader title="Recommendations" subtitle="What colleagues and clients say about working with me" />
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{recommendations.map((rec, index) => {
					const dateStr = formatDisplayDate(rec.date as unknown as string);
					return (
						<SectionCard key={index} hover className="group">
							<div className="flex items-start justify-between mb-4">
								<Quote className="text-[var(--accent-primary)] flex-shrink-0 mt-1" size={22} />
								{rec.linkedin && (
									<a href={rec.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-secondary)] hover:text-[var(--accent-primary)] transition-colors" aria-label="View LinkedIn profile">
										<Linkedin size={18} />
									</a>
								)}
							</div>
							<blockquote className="text-[var(--text-secondary)] text-base mb-5 leading-relaxed">“{rec.content.length > 180 ? rec.content.slice(0, 180) + '…' : rec.content}”</blockquote>
							{rec.content.length > 180 && (<Link href="#" className="text-[var(--accent-primary)] text-sm font-medium hover:underline">Read full</Link>)}
							<div className="flex items-center gap-3">
								{rec.photo && <Image src={rec.photo} alt={rec.name} width={44} height={44} className="w-11 h-11 rounded-full object-cover" />}
								<div className="flex-1">
									<div className="flex items-center gap-2 flex-wrap">
										<h4 className="font-semibold text-[var(--text-primary)] text-base">{rec.name}</h4>
										<span className="text-[var(--accent-primary)] text-sm font-medium">{rec.position}</span>
										<span className="text-[var(--text-secondary)] text-sm">{rec.company}</span>
									</div>
									{rec.relationship && <p className="text-[var(--text-secondary)] text-sm mt-0.5">{rec.relationship}</p>}
								</div>
							</div>
							  {dateStr && (<div className="mt-4 pt-4 border-t border-[var(--accent-muted)]"><p className="text-[var(--text-secondary)] text-sm">{dateStr}</p></div>)}
						</SectionCard>
					);
				})}
			</div>
		</section>
	);
}
