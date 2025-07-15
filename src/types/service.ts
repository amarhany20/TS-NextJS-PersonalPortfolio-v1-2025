export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  features: string[];
  technologies: string[];
  pricing?: {
    basic?: number;
    standard?: number;
    premium?: number;
  };
  deliveryTime: string;
  icon?: string;
  image?: string;
  active: boolean;
}
