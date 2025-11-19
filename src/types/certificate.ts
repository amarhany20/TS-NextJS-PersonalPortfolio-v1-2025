export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string; // ISO string
  credential?: string;
  description?: string;
  skills: string[];
  image?: string;
  verifyUrl?: string;
  createdAt: string;
  updatedAt: string;
}
