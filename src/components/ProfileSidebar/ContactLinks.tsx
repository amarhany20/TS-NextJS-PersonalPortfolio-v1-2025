'use client';

import { Mail, MessageCircle } from 'lucide-react';
import { Github, Linkedin, Youtube } from '@/components/UI/BrandIcons';
import { useState } from 'react';

type SocialMeta = Record<string, unknown>;

export default function ContactLinks() {
  const [social] = useState<SocialMeta | null>(null);
  const [email] = useState<string | null>(null);

  // Static fallback only; edit src/data/index.ts for real values.

  const linkedInUrl = (social?.linkedInUrl as string) || '#';
  const githubUrl = (social?.githubUrl as string) || '#';
  const youtubeUrl = (social?.youtubeUrl as string) || '#';
  const whatsappUrl = (social?.whatsappUrl as string) || undefined;

  return (
    <div className="flex gap-3 items-center justify-center pt-4 mt-auto">
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          aria-label="WhatsApp"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <MessageCircle
            size={24}
            className="text-[#25D366] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg"
          />
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} aria-label="Email" className="group">
          <Mail
            size={24}
            className="text-[var(--accent-secondary)] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg"
          />
        </a>
      )}
      <a
        href={githubUrl}
        aria-label="GitHub"
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <Github
          size={24}
          className="text-white hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg"
        />
      </a>
      <a
        href={linkedInUrl}
        aria-label="LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <Linkedin
          size={24}
          className="text-[#0A66C2] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg"
        />
      </a>
      {youtubeUrl !== '#' && (
        <a
          href={youtubeUrl}
          aria-label="YouTube"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Youtube
            size={24}
            className="text-[#FF0000] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg"
          />
        </a>
      )}
    </div>
  );
}
