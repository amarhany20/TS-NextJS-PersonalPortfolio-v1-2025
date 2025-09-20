import { ArrowRight, Download, FolderOpen } from 'lucide-react';
import { heroContent as loadHeroContent } from '@/temp-data/loaders/personal';
import MetaContent from '@/components/MetaContent';

export default async function SummarySection() {
	const heroContent = await loadHeroContent();
	const cvInfo = { downloadUrl: '/Ammar%202025%20CV%20Website%20V1.45.pdf' };
	if (!heroContent) return null;
	return (
		<section id="summary" className="relative flex flex-col items-start gap-6 py-8 md:py-14 scroll-mt-8">
			<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[var(--accent-primary)] drop-shadow-lg">{heroContent.greeting}</h1>
			<h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--accent-secondary)]">{heroContent.subtitle}</h2>
			<div className="max-w-2xl text-[var(--text-secondary)] text-lg mb-2 prose prose-invert">
				<MetaContent keyName="heroDescription" as="div" />
				<p className="mt-2">{heroContent.callToAction}</p>
			</div>
			<div className="flex flex-wrap gap-4 mt-2">
				<a href={heroContent.primaryButton.href || '/contact'} className="inline-flex items-center px-6 py-3 rounded-lg font-semibold bg-[var(--accent-primary)] text-black hover:bg-yellow-300 shadow-md transition">
					{heroContent.primaryButton.text?.trim() || 'Get in Touch'} <ArrowRight className="ml-2" size={20} />
				</a>
				{cvInfo && (
					<a href={heroContent.secondaryButton.href || cvInfo.downloadUrl} className="inline-flex items-center px-6 py-3 rounded-lg font-semibold border border-[var(--accent-secondary)] text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-white transition" target="_blank" rel="noopener noreferrer">
						<Download className="mr-2" size={20} />
						Download CV
					</a>
				)}
				<a href="https://ammarhany.com/portfolio" className="inline-flex items-center px-6 py-3 rounded-lg font-semibold bg-[var(--accent-muted)] text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-black transition" target="_blank" rel="noopener noreferrer">
					<FolderOpen className="mr-2" size={20} /> Portfolio
				</a>
			</div>
		</section>
	);
}
