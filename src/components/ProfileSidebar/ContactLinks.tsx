import { Mail, Linkedin, MessageCircle, Github, Youtube } from "lucide-react";

export default function ContactLinks() {
  return (
    <div className="flex gap-3 items-center justify-center pt-4 mt-auto">
      <a href="https://wa.me/905395775990" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="group">
        <MessageCircle size={24} className="text-[#25D366] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg" />
      </a>
      <a href="mailto:ammarhanyezeldin@gmail.com" aria-label="Email" className="group">
        <Mail size={24} className="text-[var(--accent-secondary)] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg" />
      </a>
      <a href="https://github.com/amarhany20" aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="group">
        <Github size={24} className="text-white hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg" />
      </a>
      <a href="https://www.linkedin.com/in/ammar-hany/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="group">
        <Linkedin size={24} className="text-[#0A66C2] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg" />
      </a>
      <a href="https://www.youtube.com/@TheChillTechgineer" aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="group">
        <Youtube size={24} className="text-[#FF0000] hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg" />
      </a>
    </div>
  );
}
