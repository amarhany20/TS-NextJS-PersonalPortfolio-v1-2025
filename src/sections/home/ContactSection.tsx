"use client";
import { personalInfo as loadPersonalInfo } from '@/temp-data/loaders/personal';
import { metadata } from '@/temp-data/metadata';
import { Mail, MessageCircle, MapPin, Smartphone, Link as LinkIcon, Github, Linkedin, Youtube, Globe2 } from 'lucide-react';
import { contactLeads } from '@/temp-data/presentation';
import { useEffect, useState } from 'react';

interface PersonalInfoShape { fullName: string; legalName: string; title: string; email: string; location: string; heroGreeting: string; heroSubtitle: string }

export default function ContactSection() {
	const [personal, setPersonal] = useState<PersonalInfoShape | null>(null);
	useEffect(() => { (async () => { setPersonal(await loadPersonalInfo()); })(); }, []);

	const turkeyPhone = metadata.phones.find(p => p.label.toLowerCase() === 'turkey')?.e164 || metadata.phones[0].e164;
	const waLink = `https://wa.me/${turkeyPhone.replace(/[^0-9]/g,'')}`;
	const socialLinks = { whatsapp: waLink, linkedin: metadata.links.find(l => /linkedin/i.test(l.label))?.href || '#' } as const;

	const meta = new Map<string,string>();
	const contactTitle = (meta.get('contactSectionTitle') || 'Get In Touch').trim();
	const contactDescription = (meta.get('contactSectionDescription') || "Let's discuss your project or collaboration opportunities").trim();

	if (!personal) return (
		<section id="contact" className="scroll-mt-8">
			<h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">{contactTitle}</h2>
			<p className="text-[var(--text-secondary)] text-sm md:text-base">{contactDescription}</p>
		</section>
	);

	const primaryEmail = personal.email || 'you@example.com';
	const whatsappPhone = turkeyPhone.replace(/^(\+\d{2})(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3 $4');
	const primaryLocation = personal.location || 'Your City';
	const leftLead = contactLeads.left; const rightLead = contactLeads.right;

		return (
			<section id="contact" className="scroll-mt-8 relative">
				<div className="relative grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
					{/* Column 1–2: Details */}
					<div className="space-y-8 z-10 xl:col-span-2">
					<header className="space-y-4">
						<h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{contactTitle}</h2>
						<p className="text-[var(--text-secondary)] max-w-prose text-sm md:text-base">{contactDescription}</p>
					</header>
					<p className="text-[var(--text-secondary)] leading-relaxed max-w-prose text-sm md:text-base">{leftLead}</p>

						<div className="flex flex-col gap-6">
							<div className="flex items-start gap-4">
								<Mail className="w-6 h-6 text-[var(--accent-primary)] mt-1" />
								<div><p className="text-[var(--text-secondary)] text-base uppercase tracking-wide mb-1">Email</p><a href={`mailto:${primaryEmail}`} className="text-foreground font-medium hover:text-[var(--accent-primary)] transition-colors">{primaryEmail}</a></div>
							</div>
							{/* Phones */}
							{(() => {
								const egypt = metadata.phones.find(p => /egypt/i.test(p.label));
								const turkey = metadata.phones.find(p => /turkey/i.test(p.label));
								return (
									<>
										{egypt && (
											<div className="flex items-start gap-4">
												<Smartphone className="w-6 h-6 text-[var(--accent-primary)] mt-1" />
												<div><p className="text-[var(--text-secondary)] text-base uppercase tracking-wide mb-1">{egypt.label}</p><a href={`tel:${egypt.e164}`} className="text-foreground font-medium hover:text-[var(--accent-primary)] transition-colors">{egypt.e164}</a></div>
											</div>
										)}
										{turkey && (
											<div className="flex items-start gap-4">
												<Smartphone className="w-6 h-6 text-[var(--accent-primary)] mt-1" />
												<div><p className="text-[var(--text-secondary)] text-base uppercase tracking-wide mb-1">{turkey.label}</p><a href={`tel:${turkey.e164}`} className="text-foreground font-medium hover:text-[var(--accent-primary)] transition-colors">{turkey.e164}</a></div>
											</div>
										)}
									</>
								);
							})()}
							<div className="flex items-start gap-4">
								<MessageCircle className="w-6 h-6 text-[var(--accent-primary)] mt-1" />
								<div><p className="text-[var(--text-secondary)] text-base uppercase tracking-wide mb-1">WhatsApp</p><a href={(socialLinks.whatsapp as string) || '#'} target="_blank" className="text-foreground font-medium hover:text-[var(--accent-primary)] transition-colors" rel="noopener noreferrer">{whatsappPhone}</a></div>
							</div>
							<div className="flex items-start gap-4">
								<MapPin className="w-6 h-6 text-[var(--accent-primary)] mt-1" />
								<div><p className="text-[var(--text-secondary)] text-base uppercase tracking-wide mb-1">Location</p><p className="text-foreground font-medium">{primaryLocation}</p></div>
							</div>
						</div>

								<div className="mt-6">
									<p className="text-[var(--text-secondary)] text-sm italic max-w-prose">{rightLead}</p>
									<div className="mt-4 flex flex-wrap items-center gap-3">
							{metadata.links.map(l => {
								const key = l.label.toLowerCase();
								const IconComp: React.ComponentType<React.SVGProps<SVGSVGElement>> =
									key.includes('github') ? Github :
									key.includes('linkedin') ? Linkedin :
									key.includes('youtube') ? Youtube :
									(key.includes('website') || key.includes('portfolio')) ? Globe2 : LinkIcon;
								return (
												<a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--accent-muted)] hover:bg-[var(--accent-primary)] hover:text-black transition-colors shadow-sm">
										<IconComp className="w-4 h-4" />
										<span className="text-sm font-medium">{l.label}</span>
									</a>
								);
							})}
						</div>
					</div>
				</div>
							{/* Column 3: CTA Panel */}
							<div className="w-full flex flex-col gap-5">
								<div className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)]/60 backdrop-blur-sm p-6 shadow-md flex flex-col gap-5">
									<h3 className="text-xl font-semibold text-foreground">Start a Conversation</h3>
									<p className="text-sm text-[var(--text-secondary)] leading-relaxed">Whether you need backend architecture, cloud deployment, AI integration, or full‑stack product development—I'm happy to help. Choose a channel below and I'll respond promptly.</p>
									<div className="grid grid-cols-2 gap-3">
										<a href={`mailto:${primaryEmail}`} className="h-11 rounded-md bg-[var(--accent-primary)] text-black text-sm font-semibold flex items-center justify-center hover:brightness-110 transition-colors shadow">Email</a>
										<a href={(socialLinks.whatsapp as string) || '#'} target="_blank" rel="noopener" className="h-11 rounded-md bg-[var(--success)] text-black text-sm font-semibold flex items-center justify-center hover:brightness-110 transition-colors shadow">WhatsApp</a>
										<a href={socialLinks.linkedin as string} target="_blank" rel="noopener" className="h-11 rounded-md bg-[var(--accent-secondary)] text-white text-sm font-semibold flex items-center justify-center hover:brightness-110 transition-colors shadow col-span-2">LinkedIn</a>
									</div>
									<div className="text-xs text-[var(--text-secondary)] leading-relaxed">
										<p><strong className="text-[var(--accent-primary)]">Typical Response:</strong> &lt; 12 hours</p>
										<p className="mt-1">Timezones: TRT (UTC+3) / EET (UTC+2)</p>
									</div>
									<hr className="border-[var(--border)]" />
									<ul className="space-y-2 text-sm text-[var(--text-secondary)] list-disc list-inside">
										<li>Freelance & part‑time opportunities</li>
										<li>Long-term collaboration / consulting</li>
										<li>Cloud, backend, AI & automation</li>
										<li>Codebase audits & performance reviews</li>
									</ul>
								</div>
								<div className="rounded-lg border border-dashed border-[var(--border)] p-5 text-sm text-[var(--text-secondary)] leading-relaxed">
									<p><span className="text-[var(--accent-primary)] font-medium">Need a fast estimate?</span> Include scope, stack preferences, timeline, and deployment target. I can provide a structured plan or phased roadmap.</p>
								</div>
							</div>
			</div>
		</section>
	);
}
