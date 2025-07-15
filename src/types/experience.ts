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
