import { socialLinks } from "@/utils/helpers";
import { Mail, MessageCircle, Github, Linkedin, Youtube } from "lucide-react";

export default function SocialLinks() {
  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-center mb-3">Connect</h3>
      <div className="flex flex-col items-center gap-2">
        <a href={socialLinks.whatsapp} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--accent-muted)] transition-all duration-200 group">
          <MessageCircle size={16} className="text-[#25D366] group-hover:scale-110 transition-transform" />
        </a>

        <a href={socialLinks.email} aria-label="Email" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--accent-muted)] transition-all duration-200 group">
          <Mail size={16} className="text-[var(--accent-secondary)] group-hover:scale-110 transition-transform" />
        </a>

        <a href={socialLinks.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--accent-muted)] transition-all duration-200 group">
          <Github size={16} className="text-white group-hover:scale-110 transition-transform" />
        </a>

        <a href={socialLinks.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--accent-muted)] transition-all duration-200 group">
          <Linkedin size={16} className="text-[#0A66C2] group-hover:scale-110 transition-transform" />
        </a>

        <a href={socialLinks.youtube} aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--accent-muted)] transition-all duration-200 group">
          <Youtube size={16} className="text-[#FF0000] group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  );
}
