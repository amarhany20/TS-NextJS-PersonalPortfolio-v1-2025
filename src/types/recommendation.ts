export interface Recommendation {
  id: string | number;
  name: string;
  // Some records use `position` instead of `title`
  title?: string;
  position?: string;
  company?: string;
  relationship?: string;
  content: string;
  // Optional auxiliary fields present in the static data
  rating?: number;
  photo?: string | null;
  avatar?: string;
  linkedin?: string;
  linkedinUrl?: string;
  recommendationLetterUrl?: string;
  date?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
