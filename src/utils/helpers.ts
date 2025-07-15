// Date formatting utilities
export const formatDate = (dateString: string, format: "short" | "long" = "short"): string => {
  const date = new Date(dateString);

  if (format === "short") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateRange = (startDate: string, endDate: string | null): string => {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : "Present";
  return `${start} - ${end}`;
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Skill level utilities
export const getSkillLevelColor = (level: string): string => {
  switch (level) {
    case "beginner":
      return "bg-[var(--warning)]";
    case "intermediate":
      return "bg-[var(--accent-secondary)]";
    case "advanced":
      return "bg-[var(--success)]";
    case "expert":
      return "bg-[var(--accent-primary)]";
    default:
      return "bg-[var(--accent-muted)]";
  }
};

// Reading time calculation
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Social media links
export const socialLinks = {
  whatsapp: "https://wa.me/905395775990",
  email: "mailto:ammarhanyezeldin@gmail.com",
  github: "https://github.com/amarhany20",
  linkedin: "https://www.linkedin.com/in/ammar-hany/",
  youtube: "https://www.youtube.com/@TheChillTechgineer",
};
