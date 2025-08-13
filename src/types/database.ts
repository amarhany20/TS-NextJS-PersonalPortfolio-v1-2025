// Database service types
export interface HeroContent {
  id: number;
  greeting: string;
  subtitle: string;
  description: string;
  callToAction: string;
  primaryButton: { text: string; href: string };
  secondaryButton: { text: string; href: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInfo {
  id: number;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  type: string;
  description: string;
  achievements: string[];
  skills: string[];
  companyUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  location: string;
  gpa: string | null;
  description: string;
  achievements: string[];
  courses: string[];
  thesis: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  experience: string;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillCategory {
  id: number;
  name: string;
  title: string;
  icon: string;
  skills: Skill[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credential: string | null;
  description: string;
  skills: string[];
  image: string | null;
  verifyUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recommendation {
  id: number;
  name: string;
  position: string;
  company: string;
  relationship: string;
  content: string;
  rating: number;
  date: string;
  linkedin: string | null;
  photo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  technologies: string[];
  pricing: { price: string; duration: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface Language {
  id: number;
  name: string;
  level: string;
  proficiency: number;
  description: string;
  certificate: string | null;
  flag: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  publishedAt: Date;
  category: string;
  tags: string[];
  readTime: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string | null;
  image: string | null;
  gallery: string[];
  technologies: string[];
  features: string[];
  demoUrl: string | null;
  githubUrl: string | null;
  status: string;
  category: string;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Metadata {
  id: number;
  key: string;
  value: string;
  type: string;
  category: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CVInfo {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  downloadUrl: string;
  viewUrl: string | null;
  fileSize: string;
  lastUpdated: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

// Additional types for metadata values
export interface SocialLinks {
  whatsapp: string;
  email: string;
  github: string;
  linkedin: string;
  youtube: string;
}
