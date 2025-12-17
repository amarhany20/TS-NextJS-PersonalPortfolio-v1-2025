import SectionHeader from '@/components/ui/SectionHeader';
import SectionCard from '@/components/ui/SectionCard';
import { formatMonthYear } from '@/utils/helpers';
import { Linkedin, Quote, FileText } from 'lucide-react';
import Image from 'next/image';
import type { Recommendation } from '@/types/recommendation';

function formatDisplayDate(value: string | Date): string {
	if (!value) return '';
	if (typeof value !== 'string') return formatMonthYear(value.toString());
	if (/present/i.test(value)) return 'Present';
	return formatMonthYear(value);
}

interface RecommendationsSectionProps {
  items?: Recommendation[];
}

export default function RecommendationsSection({ items }: RecommendationsSectionProps) {
	const recommendations = items ?? [];
	return (
		<section id="recommendations" className="scroll-mt-8">
			<SectionHeader title="Recommendations" subtitle="What colleagues and clients say about working with me" />
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{recommendations.map((rec: Recommendation, index) => {
					const dateStr = formatDisplayDate(String(rec.date ?? ''));

					// Determine link strategy
					const hasLetter = !!rec.recommendationLetterUrl;
					const hasLinkedIn = !!rec.linkedin || !!rec.linkedinUrl;
					const primaryLink = rec.recommendationLetterUrl ?? rec.linkedin ?? rec.linkedinUrl;
					const multipleLinks = hasLetter && hasLinkedIn && rec.recommendationLetterUrl !== rec.linkedin;
					const useOuterAnchor = !!primaryLink && !multipleLinks; // only safe when we have a single target

					const headerIcons = (
						<div className="flex items-center gap-2">
							{hasLetter && (!useOuterAnchor || primaryLink !== rec.recommendationLetterUrl) && (
								<a
									href={rec.recommendationLetterUrl!}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Open recommendation letter PDF"
									className="text-[var(--accent-secondary)] hover:text-[var(--accent-primary)] transition-colors"
								>
									<FileText size={18} />
								</a>
							)}
							{hasLinkedIn && (
								primaryLink === rec.linkedin && useOuterAnchor ? (
									<Linkedin
										size={18}
										aria-label="LinkedIn profile"
										className="text-[var(--accent-secondary)] group-hover:text-[var(--accent-primary)] transition-colors"
									/>
								) : (
									<a
										href={rec.linkedin || rec.linkedinUrl!}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="View LinkedIn profile"
										className="text-[var(--accent-secondary)] hover:text-[var(--accent-primary)] transition-colors"
									>
										<Linkedin size={18} />
									</a>
								)
							)}
						</div>
					);

					const cardInner = (
						<SectionCard hover className="group h-full">
							<div className="flex items-start justify-between mb-4">
								<Quote className="text-[var(--accent-primary)] flex-shrink-0 mt-1" size={22} />
								{headerIcons}
							</div>
							<blockquote className="text-[var(--text-secondary)] text-base mb-5 leading-relaxed">
								&ldquo;{rec.content.length > 180 ? rec.content.slice(0, 180) + '…' : rec.content}&rdquo;
							</blockquote>
							{rec.content.length > 180 && (
								<div className="text-[var(--accent-primary)] text-sm font-medium hover:underline">Read full</div>
							)}
							<div className="flex items-center gap-3">
								{rec.photo && (
									<Image src={rec.photo} alt={rec.name} width={44} height={44} className="w-11 h-11 rounded-full object-cover" />
								)}
								<div className="flex-1">
									<div className="flex items-center gap-2 flex-wrap">
										<h4 className="font-semibold text-[var(--text-primary)] text-base">{rec.name}</h4>
										<span className="text-[var(--accent-primary)] text-sm font-medium">{rec.position ?? rec.title}</span>
										<span className="text-[var(--text-secondary)] text-sm">{rec.company}</span>
									</div>
									{rec.relationship && (
										<p className="text-[var(--text-secondary)] text-sm mt-0.5">{rec.relationship}</p>
									)}
								</div>
							</div>
							{dateStr && (
								<div className="mt-4 pt-4 border-t border-[var(--accent-muted)]">
									<p className="text-[var(--text-secondary)] text-sm">{dateStr}</p>
								</div>
							)}
						</SectionCard>
					);

					if (useOuterAnchor && primaryLink) {
						return (
							<a
								key={index}
								href={primaryLink}
								target="_blank"
								rel="noopener noreferrer"
								className="block hover:scale-[1.02] transition-transform"
							>
								{cardInner}
							</a>
						);
					}

					return (
						<div key={index} className="group">
							{cardInner}
						</div>
					);
				})}
			</div>
		</section>
	);
}