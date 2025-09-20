import type { EducationItem } from '@/types';

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
