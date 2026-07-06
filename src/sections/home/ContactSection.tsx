"use client";
import { Mail, MessageCircle, MapPin, Smartphone, Link as LinkIcon, Github, Linkedin, Youtube } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import type { ContactDetails, LinkItem } from '@/types/settings';

interface ContactSectionProps {
	details: ContactDetails;
	socialLinks?: LinkItem[];
}

/**
 * Converts a configured phone number into a WhatsApp deep link when possible.
 */
function normaliseWhatsappLink(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^0-9+]/g, '');
  const numeric = digits.replace(/^\+/, '');
  return numeric ? `https://wa.me/${numeric}` : undefined;
}

const SOCIAL_ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
};

/**
 * Renders the public contact block without leaking template fallback contact data.
 */
export default function ContactSection({ details, socialLinks }: ContactSectionProps) {
	const contactTitle = details.title || 'Get In Touch';
	const contactDescription = details.description || details.subtitle || "Let's discuss your project or collaboration opportunities";
	const emails = details.emails ?? [];
	const primaryEmail = emails[0];
	const phones = details.phones ?? [];
	const whatsappLink = normaliseWhatsappLink(phones[0]?.e164);
	const whatsappDisplay = phones[0]?.e164?.replace(/^(\+\d{1,3})(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3 $4') || phones[0]?.e164;
	const location = details.location || 'Remote';
	const leftLead = details.leads?.left ?? 'Direct channels for professional inquiries, consulting engagements, collaborations, or technical leadership support.';
	const rightLead = details.leads?.right ?? 'Ready to start? Reach out via email, WhatsApp, or LinkedIn.';

	const filteredSocialLinks = (socialLinks ?? []).filter((link) => !/website|portfolio/i.test(link.label));

	return (
		<section id="contact" className="scroll-mt-8 relative">
			<div className="relative grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
				<div className="space-y-8 z-10 xl:col-span-2">
				<header className="space-y-4">
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{contactTitle}</h2>
					<p className="text-[var(--text-secondary)] max-w-prose text-sm md:text-base">{contactDescription}</p>
				</header>
				<p className="text-[var(--text-secondary)] leading-relaxed max-w-prose text-sm md:text-base">{leftLead}</p>

					<div className="flex flex-col gap-6">
						{primaryEmail ? (
							<div className="flex items-start gap-4">
								<Mail className="w-6 h-6 text-[var(--accent-primary)] mt-1" />
								<div><p className="text-[var(--text-secondary)] text-base uppercase tracking-wide mb-1">Email</p><a href={`mailto:${primaryEmail}`} className="text-foreground font-medium hover:text-[var(--accent-primary)] transition-colors">{primaryEmail}</a></div>
							</div>
						) : null}
						{phones.map((phone) => (
							<div key={phone.e164} className="flex items-start gap-4">
								<Smartphone className="w-6 h-6 text-[var(--accent-primary)] mt-1" />
								<div><p className="text-[var(--text-secondary)] text-base uppercase tracking-wide mb-1">{phone.label}</p><a href={`tel:${phone.e164}`} className="text-foreground font-medium hover:text-[var(--accent-primary)] transition-colors">{phone.e164}</a></div>
							</div>
						))}
						{whatsappLink ? (
							<div className="flex items-start gap-4">
								<MessageCircle className="w-6 h-6 text-[var(--accent-primary)] mt-1" />
								<div><p className="text-[var(--text-secondary)] text-base uppercase tracking-wide mb-1">WhatsApp</p><a href={whatsappLink} target="_blank" className="text-foreground font-medium hover:text-[var(--accent-primary)] transition-colors" rel="noopener noreferrer">{whatsappDisplay}</a></div>
							</div>
						) : null}
						<div className="flex items-start gap-4">
							<MapPin className="w-6 h-6 text-[var(--accent-primary)] mt-1" />
							<div><p className="text-[var(--text-secondary)] text-base uppercase tracking-wide mb-1">Location</p><p className="text-foreground font-medium">{location}</p></div>
						</div>
					</div>

					<div className="mt-6">
						<p className="text-[var(--text-secondary)] text-sm italic max-w-prose">{rightLead}</p>
						<div className="mt-4 flex flex-wrap items-center gap-3">
							{filteredSocialLinks.map((link) => {
								const key = link.label.toLowerCase();
								const IconComp = SOCIAL_ICON_MAP[key] ?? LinkIcon;
								return (
									<a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--accent-muted)] hover:bg-[var(--accent-primary)] hover:text-black transition-colors shadow-sm">
										<IconComp className="w-4 h-4" />
										<span className="text-sm font-medium">{link.label}</span>
									</a>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}


