interface AccentBarProps {
  direction?: "primary-to-secondary" | "secondary-to-primary";
  className?: string;
}

export default function AccentBar({ direction = "primary-to-secondary", className = "" }: AccentBarProps) {
  const gradient = direction === "primary-to-secondary" ? "from-[var(--accent-primary)] to-[var(--accent-secondary)]" : "from-[var(--accent-secondary)] to-[var(--accent-primary)]";
  return <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradient} ${className}`}></div>;
}
