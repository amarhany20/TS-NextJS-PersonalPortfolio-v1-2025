import type { EducationItem } from '@/types/education';

export interface Education {
  id: number | string;
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
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Raw source education items
export const educationItems: readonly EducationItem[] = [
  {
    institution: 'Toros University',
    degree: 'B.Sc.',
    field: 'Computer and Software Engineering',
    location: 'Mersin, Turkey',
    start: '2019-09',
    end: '2023-07',
    gpa: '3.77/4.00',
    achievements: [
      'Graduated 1st in department & faculty',
      'Board member – Computer Sciences Community',
      'Represented university at Teknofest 2023 (Top 25)',
    ],
    project: 'Self-Driving Car using Behavioral Cloning (TensorFlow/Keras CNNs)',
  },
] as const;

// Transformed education array (DB/loader compatible)
export const education: Education[] = educationItems.map((e, idx) => ({
  id: idx + 1,
  institution: e.institution,
  degree: e.degree,
  field: e.field,
  location: e.location,
  start: e.start,
  end: e.end,
  present: !e.end,
  gpa: e.gpa,
  achievements: e.achievements ? [...e.achievements] : [],
  project: e.project,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

