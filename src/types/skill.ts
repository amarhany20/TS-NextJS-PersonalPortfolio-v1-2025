export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "tools" | "other";
  level: "beginner" | "intermediate" | "advanced" | "expert";
  years: number;
  icon?: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}
