export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  features: string[];
  technologies: string[];
  // pricing and deliveryTime removed — handled outside of the service object
  icon?: string;
  image?: string;
  active?: boolean;
  displayOrder?: number;
}
