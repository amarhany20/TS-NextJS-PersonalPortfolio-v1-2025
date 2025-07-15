interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h2>
      {subtitle && <p className="text-[var(--text-secondary)] text-sm md:text-base">{subtitle}</p>}
    </div>
  );
}
