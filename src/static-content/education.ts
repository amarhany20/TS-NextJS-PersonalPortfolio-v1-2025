import type { EducationItem } from '@/types/education'

export interface Education {
  id: number | string
  institution: string
  degree: string
  field?: string
  location?: string
  start: string
  end?: string
  present: boolean
  gpa?: string
  achievements: string[]
  project?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

// Generic example education items (safe for the public template)
export const educationItems: readonly EducationItem[] = [
  {
    institution: 'Example University',
    degree: 'BSc Computer Science',
    field: 'Computer Science',
    location: 'Your City',
    start: '2020-09',
    end: '2024-06',
    gpa: '3.8/4.0',
    achievements: ['Replace with your own achievements.'],
    project: 'Capstone Project (replace this)',
  },
] as const

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

}))

