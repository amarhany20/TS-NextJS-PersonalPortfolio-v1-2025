import type { Education as EducationDB } from '@/types/database';
import type { EducationItem } from '@/types';

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
export const education: EducationDB[] = educationItems.map((e, idx) => {
  const now = new Date();
  return {
    id: idx + 1,
    institution: e.institution,
    degree: e.degree,
    field: e.field ?? '',
    duration: e.end ? `${e.start} - ${e.end}` : `${e.start} - Present`,
    location: e.location || '',
    gpa: e.gpa || null,
    description: e.project || '',
    achievements: e.achievements ? [...e.achievements] : [],
    courses: [],
    thesis: null,
    createdAt: now,
    updatedAt: now,
  } as EducationDB;
});

