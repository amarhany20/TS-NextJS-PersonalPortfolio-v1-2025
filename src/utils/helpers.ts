// Date formatting utilities
export const formatDate = (dateString: string, format: 'short' | 'long' = 'short'): string => {
  const date = new Date(dateString);

  if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format a date string (YYYY-MM or full ISO) to MM/YYYY
export function formatMonthYear(value?: string | null): string {
  if (!value) return '';
  // Accept YYYY-MM
  const monthPart = value.slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(monthPart)) {
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
  const [y, m] = monthPart.split('-');
  return `${m}/${y}`;
}

// Format project duration given YYYY-MM start/end strings
export function formatProjectDuration(start: string, end?: string) {
  const [sy, sm] = start.split('-').map(Number);
  const startDate = new Date(sy, (sm || 1) - 1, 1);
  const endDate = end
    ? (() => {
        const [ey, em] = end.split('-').map(Number);
        return new Date(ey, (em || 1) - 1, 1);
      })()
    : new Date();
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years}y`);
  if (rem > 0) parts.push(`${rem}m`);
  if (!parts.length) parts.push('<1m');
  return parts.join(' ');
}
export const formatDateRange = (startDate: string, endDate: string | null): string => {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Present';
  return `${start} - ${end}`;
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Skill level utilities
export const getSkillLevelColor = (level: string): string => {
  switch (level) {
    case 'beginner':
      return 'bg-[var(--warning)]';
    case 'intermediate':
      return 'bg-[var(--accent-secondary)]';
    case 'advanced':
      return 'bg-[var(--success)]';
    case 'expert':
      return 'bg-[var(--accent-primary)]';
    default:
      return 'bg-[var(--accent-muted)]';
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
// export const socialLinks = {
//   whatsapp: "https://wa.me/1234567890",
//   email: "mailto:you@example.com",
//   github: "https://github.com/your-username",
//   linkedin: "https://www.linkedin.com/in/your-profile",
//   youtube: "https://www.youtube.com/@your-channel",
// };
