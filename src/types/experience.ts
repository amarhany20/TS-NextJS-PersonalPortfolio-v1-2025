// Unified display-ready Experience shape (consolidated from previous DB + seed variants)
export interface Experience {
  id: number | string;
  company: string;
  title: string;
  location: string;
  start: string;          // YYYY-MM
  end?: string;           // YYYY-MM (absent => present)
  present: boolean;       // derived convenience flag
  impact: string;         // primary summary / impact statement
  achievements: string[]; // bullet highlights (trimmed selection)
  skills: string[];       // technology / stack display
  companyUrl?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Lightweight static seed format (no ids) used in static-content
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
