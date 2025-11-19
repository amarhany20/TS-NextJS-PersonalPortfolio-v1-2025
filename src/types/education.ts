export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  start: string;
  end?: string;
  present: boolean;
  gpa?: string;
  achievements: string[];
  project?: string;
  createdAt: string;
  updatedAt: string;
}

// Flat static-content shape used before mapping into database and UI-ready Education objects
export interface EducationItem {
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  start: string; // YYYY-MM
  end?: string;  // YYYY-MM
  gpa?: string;
  achievements?: string[];
  project?: string;
}
