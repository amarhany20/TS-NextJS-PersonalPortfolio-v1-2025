// Simplified Portfolio Types (MVP Friendly)
// ----------------------------------------
// Flattened single `Project` interface to reduce cognitive load.
// Removed layered meta wrapper, badges abstraction, and list projection.
// Keep only fields that are directly useful for display & filtering now.
// You can always re-introduce separation later if a real backend / CMS appears.

export type ProjectVisibility = 'public' | 'private' | 'internal';
export type ProjectAccess = 'open-source' | 'proprietary' | 'client-owned';
export type ProjectStatus = 'planning' | 'in-progress' | 'live' | 'archived';

// Gallery asset (kept minimal)

export interface ProjectGalleryItem {
  id: string;
  image: string;
  alt?: string;
  title?: string;
}

// Narrative sub-section (kept: id/title/body/order). Might be optional later.
export interface ProjectSection {
  id: string;
  title: string;
  body: string;
  order: number;
}

// Main simplified shape
export interface Project {
  slug: string;
  title: string;
  tagline: string;
  intro: string;              // Short description
  summary: string;            // Slightly longer description
  visibility: ProjectVisibility;
  access: ProjectAccess;
  status: ProjectStatus;
  domain?: string;            // Optional category
  company?: string;
  client?: string;
  website?: string;
  repository?: string | null;
  role: string;
  start: string;              // YYYY-MM
  end?: string;
  stack: string[];            // Technologies (display order)
  features?: string[];        // Optional highlight bullets
  sections?: ProjectSection[]; // Optional deep-dive sections
  gallery?: ProjectGalleryItem[]; // Optional visuals
  confidentialNotes?: string; // Only shown internally if needed
  createdAt: string;
  updatedAt: string;
}

// (Removed previous extended example & projection logic for clarity.)
