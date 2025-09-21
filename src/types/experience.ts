export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null; // null for current position
  description: string[];
  technologies: string[];
  achievements: string[];
}

// Lightweight static seed format (no ids) used in temp-data
export interface ExperienceItem {
  company: string;
  title: string;
  location: string;
  start: string; // YYYY-MM
  end?: string;  // YYYY-MM
  present?: boolean;
  bullets: readonly string[];
  stack?: readonly string[];
  impact?: string;
}
