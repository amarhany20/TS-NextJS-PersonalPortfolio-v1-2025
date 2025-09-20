export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string[];
  achievements: string[];
}

// Flat temp-data shape used before mapping into database-style Education objects
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
