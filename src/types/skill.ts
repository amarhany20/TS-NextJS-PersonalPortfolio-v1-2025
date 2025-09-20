// Simplified skill model for display-only grouping.
// Dynamic categories come from data layer, no fixed unions or levels.
export interface SkillItem {
  name: string;
  icon?: string; // icon name, emoji or lucide id
}

export interface SkillGroupDisplay {
  id: string;      // stable slug (e.g. backend, frontend)
  title: string;   // human-readable title
  summary?: string;
  skills: SkillItem[];
}

// Backwards compatibility export names if other modules imported old ones.
export type Skill = SkillItem;
export interface SkillCategory { category: string; skills: SkillItem[] }
