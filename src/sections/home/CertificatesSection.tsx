"use client";
import SectionHeader from '@/components/UI/SectionHeader';
import SectionCard from '@/components/UI/SectionCard';
import { useCertificates } from '@/hooks/useStaticData';
import { formatMonthYear } from '@/utils/helpers';

export default function CertificatesSection() {
	const certificates = useCertificates();
	if (!certificates?.length) return (<section id="certificates" className="scroll-mt-8"><SectionHeader title="Certificates" subtitle="Professional certifications and achievements" /><div className="flex items-center justify-center py-12"><p className="text-[var(--text-secondary)]">No certificates available</p></div></section>);
	return (
		<section id="certificates" className="scroll-mt-8">
			<SectionHeader title="Certificates" subtitle="Professional certifications and achievements" />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{certificates.map((cert, index) => {
						if (cert.verifyUrl) {
							return (
								<a key={index} href={cert.verifyUrl} className="group" aria-label={`Open ${cert.name} PDF`}>
									<SectionCard hover className="group">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1"><h3 className="text-lg font-semibold text-foreground mb-1">{cert.name}</h3><p className="text-[var(--accent-primary)] font-medium mb-2">{cert.issuer}</p></div>
										</div>
										<div className="mb-4">
											<p className="text-[var(--text-secondary)] text-sm mb-2">{cert.description}</p>
											<div className="flex flex-col gap-1 text-sm">
												<p className="text-[var(--text-secondary)]"><span className="font-medium">Completed:</span> {formatMonthYear(cert.date)}</p>
											</div>
										</div>
									</SectionCard>
								</a>
							);
						}
						return (
							<SectionCard key={index} hover className="group">
								<div className="flex items-start justify-between mb-4">
									<div className="flex-1"><h3 className="text-lg font-semibold text-foreground mb-1">{cert.name}</h3><p className="text-[var(--accent-primary)] font-medium mb-2">{cert.issuer}</p></div>
								</div>
								<div className="mb-4">
									<p className="text-[var(--text-secondary)] text-sm mb-2">{cert.description}</p>
									<div className="flex flex-col gap-1 text-sm">
										<p className="text-[var(--text-secondary)]"><span className="font-medium">Completed:</span> {formatMonthYear(cert.date)}</p>
									</div>
								</div>
							</SectionCard>
						);
					})}
			</div>

		</section>
	);
}
