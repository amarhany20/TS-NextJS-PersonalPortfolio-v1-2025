import { ReactNode } from "react";

interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  ariaLabel?: string;
}

export default function IconButton({ children, onClick, href, className = "", variant = "ghost", size = "md", disabled = false, ariaLabel }: IconButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)]";

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const variantClasses = {
    primary: "bg-[var(--accent-primary)] text-black hover:bg-[var(--accent-primary)]/90",
    secondary: "bg-[var(--accent-secondary)] text-white hover:bg-[var(--accent-secondary)]/90",
    accent: "bg-[var(--accent-muted)] text-[var(--text-secondary)] hover:bg-[var(--accent-muted)]/80 hover:text-white",
    ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--accent-muted)] hover:text-white",
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
