import type { HeroContent, ContactInfo } from '@/types/database';
import { metadata } from '../metadata';

export const personalInfo = async () => ({
  fullName: 'Ammar Hany',
  legalName: metadata.fullName,
  title: 'Software Engineer',
  email: metadata.emails[0],
  location: metadata.bases.map(b => {
    const country = b.countryCode === 'TR' ? 'Turkey' : b.countryCode === 'EG' ? 'Egypt' : b.countryCode;
    return `${b.city}, ${country}`;
  }).join(' / '),
  heroGreeting: 'Hello 👋',
  heroSubtitle: metadata.tagline,
});

export const heroContent = async (): Promise<HeroContent> => {
  const highlights = metadata.highlights.slice(0, 6);
  const descriptionHtml = `<ul>${highlights.map(h => `<li>${h}</li>`).join('')}</ul>`;
  return {
    id: 1,
    greeting: 'Hello 👋',
    subtitle: metadata.tagline,
    description: descriptionHtml,
    callToAction: 'Open to opportunities',
    primaryButton: { text: 'Get in Touch', href: '#contact' },
    // Secondary now dedicated to CV download; portfolio handled via extra field (optional UI consumption)
  secondaryButton: { text: 'Download CV', href: '/Ammar%202025%20CV%20Website%20V1.45.pdf' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const contactInfo = async (): Promise<ContactInfo> => ({
  id: 1,
  title: 'Get In Touch',
  subtitle: metadata.tagline,
  email: metadata.emails[0],
  phone: metadata.phones.map(p => `${p.label}: ${p.e164}`).join(' / '),
  location: metadata.bases.map(b => b.city).join(' / '),
  availability: metadata.relocation,
  createdAt: new Date(),
  updatedAt: new Date(),
});
