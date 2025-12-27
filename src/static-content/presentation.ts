// presentation.ts
// UI-facing derived/static presentation constants (keeps components free of hardcoded data)

// Removed skill priority arrays; ordering now derives directly from data in skills.ts

// CTA buttons shown in contact section footer
export const globalCtas = [
  { href: '/portfolio', label: 'Portfolio', variant: 'primary' as const },
  { href: '/services', label: 'Services', variant: 'secondary' as const },
  { href: '/blogs', label: 'Blogs', variant: 'default' as const },
  { href: '/contact', label: 'Contact', variant: 'outline' as const },
];

// Contact section descriptive leads (kept here for potential localization later)
export const contactLeads = {
  left: 'Direct channels for professional inquiries, consulting engagements, collaborations, or technical leadership support.',
  right: 'Ready to start? Reach out via email, WhatsApp, or LinkedIn.'
} as const;
