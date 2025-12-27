import { metadata } from './metadata';

export const personalInfo = {
  fullName: metadata.fullName,
  legalName: metadata.fullName,
  title: metadata.tagline,
  email: metadata.emails[0],
  location: metadata.bases.map((b) => `${b.city}, ${b.countryCode}`).join(' / '),
  heroGreeting: metadata.hero.greeting,
  heroSubtitle: metadata.tagline,
};

export const heroContent = {
  id: 1,
  greeting: metadata.hero.greeting,
  subtitle: metadata.tagline,
  description: `<ul>${metadata.highlights.slice(0, 6).map((h) => `<li>${h}</li>`).join('')}</ul>`,
  callToAction: metadata.hero.callToAction,
  primaryButton: metadata.hero.primaryButton,
  secondaryButton: metadata.hero.secondaryButton,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const contactInfo = {
  id: 1,
  title: metadata.contact.title,
  subtitle: metadata.tagline,
  email: metadata.emails[0],
  phone: metadata.phones.map((p) => `${p.label}: ${p.e164}`).join(' / '),
  location: metadata.bases.map((b) => b.city).join(' / '),
  // availability: metadata.relocation,
  createdAt: new Date(),
  updatedAt: new Date(),
};