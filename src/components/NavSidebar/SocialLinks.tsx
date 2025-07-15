import { socialLinks } from "@/utils/helpers";
import { Mail, MessageCircle, Github, Linkedin, Youtube } from "lucide-react";

export default function SocialLinks() {
  return (
    <div className="flex flex-col gap-4 mt-auto mb-4">
      <a href={socialLinks.whatsapp} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--accent-muted)] transition-colors group">
        <MessageCircle size={22} className="text-[#25D366] group-hover:scale-110 transition-transform" />
      </a>

      <a href={socialLinks.email} aria-label="Email" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--accent-muted)] transition-colors group">
        <Mail size={22} className="text-[var(--accent-secondary)] group-hover:scale-110 transition-transform" />
      </a>

      <a href={socialLinks.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--accent-muted)] transition-colors group">
        <Github size={22} className="text-white group-hover:scale-110 transition-transform" />
      </a>

      <a href={socialLinks.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--accent-muted)] transition-colors group">
        <Linkedin size={22} className="text-[#0A66C2] group-hover:scale-110 transition-transform" />
      </a>

      <a href={socialLinks.youtube} aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--accent-muted)] transition-colors group">
        <Youtube size={22} className="text-[#FF0000] group-hover:scale-110 transition-transform" />
      </a>
    </div>
  );
}
