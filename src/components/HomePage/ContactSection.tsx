"use client";
import SectionHeader from "@/components/UI/SectionHeader";
import SectionCard from "@/components/UI/SectionCard";
import { personalInfo as loadPersonalInfo } from "@/temp-data/loaders/personal";
import { metadata } from "@/temp-data/metadata";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { contactLeads, globalCtas } from "@/temp-data/presentation";
import dynamic from 'next/dynamic';

// Lazy load Three.js canvas on client only
const EarthCanvas = dynamic(() => import("@/components/UI/EarthCanvas"), { ssr: false });

import { useEffect, useState } from 'react';

interface PersonalInfoShape { fullName: string; legalName: string; title: string; email: string; location: string; heroGreeting: string; heroSubtitle: string }

export default function ContactSection() {
  const [personal, setPersonal] = useState<PersonalInfoShape | null>(null);
  useEffect(() => {
    (async () => { setPersonal(await loadPersonalInfo()); })();
  }, []);
  const turkeyPhone = metadata.phones.find(p => p.label.toLowerCase() === 'turkey')?.e164 || metadata.phones[0].e164;
  const waLink = `https://wa.me/${turkeyPhone.replace(/[^0-9]/g,'')}`;
  const socialLinks = { whatsapp: waLink, linkedin: metadata.links.find(l => /linkedin/i.test(l.label))?.href || "#" } as const;
  const meta = new Map<string, string>();

  const contactTitle = (meta.get('contactSectionTitle') || 'Get In Touch').trim();
  const contactDescription = (meta.get('contactSectionDescription') || "Let's discuss your project or collaboration opportunities").trim();
  // quickIntro removed; replaced with 3D visualization

  if (!personal) {
    return (
      <section id="contact" className="scroll-mt-8">
        <SectionHeader title={contactTitle} subtitle={contactDescription} />
      </section>
    );
  }

  // Extract metadata values
  const primaryEmail = personal.email || "you@example.com";
  const whatsappPhone = turkeyPhone.replace(/^(\+\d{2})(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3 $4');
  const primaryLocation = personal.location || "Your City";
  const leftLead = contactLeads.left;
  const rightLead = contactLeads.right;

  return (
    <section id="contact" className="scroll-mt-8">
      <SectionHeader title={contactTitle} subtitle={contactDescription} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Contact Information */}
        <SectionCard className="flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-2">Contact Information</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed max-w-prose">{leftLead}</p>

          <div className="space-y-5 mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent-muted)] rounded-full flex items-center justify-center">
                <Mail className="text-[var(--accent-primary)]" size={18} />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Email</p>
                <a href={`mailto:${primaryEmail}`} className="text-foreground hover:text-[var(--accent-primary)] transition-colors">
                  {primaryEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent-muted)] rounded-full flex items-center justify-center">
                <MessageCircle className="text-[var(--accent-primary)]" size={18} />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">WhatsApp</p>
                <a href={(socialLinks.whatsapp as string) || "#"} className="text-foreground hover:text-[var(--accent-primary)] transition-colors" target="_blank" rel="noopener noreferrer">
                  {whatsappPhone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent-muted)] rounded-full flex items-center justify-center">
                <MapPin className="text-[var(--accent-primary)]" size={18} />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Location</p>
                <p className="text-foreground">{primaryLocation}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 3D Earth Visualization */}
        <SectionCard className="p-0 overflow-hidden flex flex-col">
          <div className="p-6 pb-2">
            <h3 className="text-lg font-semibold text-foreground mb-2">Global Reach</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-prose">{rightLead}</p>
          </div>
          <div className="flex-1">
            <EarthCanvas />
          </div>
          <div className="p-4 grid grid-cols-1 gap-3">
            <a href={`mailto:${primaryEmail}`} className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-md bg-[var(--accent-primary)] text-black font-medium text-sm hover:brightness-110 transition-colors">
              <Mail size={18} /> Email
            </a>
            <a href={(socialLinks.whatsapp as string) || '#'} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-md bg-[var(--success)] text-black font-medium text-sm hover:brightness-110 transition-colors">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href={(socialLinks.linkedin as string) || '#'} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-md bg-[var(--accent-secondary)] text-white font-medium text-sm hover:brightness-110 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.063 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> LinkedIn
            </a>
          </div>
        </SectionCard>
      </div>

      {/* Global CTAs full width stacked on mobile, inline on md */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
        {globalCtas.map(c => (
          <ActionButton key={c.href} href={c.href} label={c.label} variant={c.variant} full />
        ))}
      </div>
    </section>
  );
}

interface BtnProps { href: string; label: string; variant?: 'primary' | 'secondary' | 'outline' | 'default'; full?: boolean }
function ActionButton({ href, label, variant = 'default', full }: BtnProps) {
  const base = `inline-flex items-center justify-center h-11 px-5 rounded-md text-sm font-semibold border transition-colors ${full ? 'w-full' : ''}`;
  const styles: Record<string,string> = {
    primary: 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-black hover:brightness-110',
    secondary: 'bg-[var(--accent-secondary)]/90 border-[var(--accent-secondary)] text-white hover:bg-[var(--accent-secondary)]',
    outline: 'bg-transparent border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]',
    default: 'bg-[var(--accent-muted)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent-primary)] hover:text-black'
  };
  return <a href={href} className={`${base} ${styles[variant]}`}>{label}</a>;
}
