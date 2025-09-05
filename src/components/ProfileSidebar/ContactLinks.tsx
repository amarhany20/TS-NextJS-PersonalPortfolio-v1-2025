"use client";

import { Mail, Linkedin, MessageCircle, Github, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api-client";

type SocialMeta = Record<string, unknown>;

export default function ContactLinks() {
  const [social, setSocial] = useState<SocialMeta | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([apiService.getMetadataByCategory("social"), apiService.getMetadataByCategory("contact")])
      .then(([socialRes, contactRes]) => {
        if (!mounted) return;
        setSocial(socialRes.data || null);
        const contact = (contactRes.data || {}) as Record<string, unknown>;
        setEmail(typeof contact.email === "string" ? contact.email : null);
      })
      .catch(() => void 0);
    return () => {
      mounted = false;
    };
  }, []);

  const linkedInUrl = (social?.linkedInUrl as string) || "#";
  const githubUrl = (social?.githubUrl as string) || "#";
  const youtubeUrl = (social?.youtubeUrl as string) || "#";
  const whatsappUrl = (social?.whatsappUrl as string) || undefined;

  return (
    <div className="flex gap-3 items-center justify-center pt-4 mt-auto">
      {whatsappUrl && (
        <a href={whatsappUrl} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="group">
          <MessageCircle size={24} className="text-[#25D366] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg" />
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} aria-label="Email" className="group">
          <Mail size={24} className="text-[var(--accent-secondary)] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg" />
        </a>
      )}
      <a href={githubUrl} aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="group">
        <Github size={24} className="text-white hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg" />
      </a>
      <a href={linkedInUrl} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="group">
        <Linkedin size={24} className="text-[#0A66C2] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg" />
      </a>
      {youtubeUrl !== "#" && (
        <a href={youtubeUrl} aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="group">
          <Youtube size={24} className="text-[#FF0000] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg" />
        </a>
      )}
    </div>
  );
}
