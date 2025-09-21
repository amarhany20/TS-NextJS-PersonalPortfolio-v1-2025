import { ReactNode } from "react";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function SectionCard({ children, className = "", hover = false }: SectionCardProps) {
  return (
    <div
      className={`
        bg-[var(--card-bg)] 
        border border-[var(--border)] 
        rounded-lg 
        p-6 
        transition-all 
        duration-300
        ${hover ? "hover:shadow-lg hover:shadow-[var(--accent-primary)]/10 hover:border-[var(--accent-primary)]/20" : ""}
        ${className}
      `}>
      {children}
    </div>
  );
}
