export interface Credential {
  title: string;
  issuer?: string;
  year: number;
  type: 'certificate' | 'award' | 'letter';
  location?: string;
  description?: string;
  tags?: string[];
}
