// Database Services - Use database instead of static files
export * from "@/lib/database-services";

// Legacy exports for backward compatibility (deprecated)
import { getPersonalInfo, getHeroContent, getContactInfo, getExperience, getEducation, getSkills, getCoreSkills, getCertificates, getRecommendations, getServices, getLanguages, getBlogPosts } from "@/lib/database-services";

// Legacy compatibility layer - these functions now fetch from database
export const personalInfo = getPersonalInfo;
export const heroContent = getHeroContent;
export const contactInfo = getContactInfo;
export const experience = getExperience;
export const education = getEducation;
export const allSkills = getSkills;
export const coreSkills = getCoreSkills;
export const certificates = getCertificates;
export const recommendations = getRecommendations;
export const services = getServices;
export const languages = getLanguages;
export const blogPosts = getBlogPosts;

// Types
export type { HeroContent, ContactInfo, Experience, Education, Skill, Certificate, Recommendation, Service, Language, BlogPost, Project } from "@/types/database";

// Central registry of metadata keys used across the site (admin reference)
// Keep synchronized with seeding logic and runtime usage.
export interface MetadataDefinition {
	key: string;
	category: string;
	type: string;
	description: string;
	required?: boolean;
}

export const METADATA_DEFINITIONS: MetadataDefinition[] = [
	{ key: 'fullName', category: 'personal', type: 'string', description: 'Primary display full name', required: true },
	{ key: 'title', category: 'personal', type: 'string', description: 'Tagline / role headline' },
	{ key: 'email', category: 'contact', type: 'string', description: 'Primary contact email', required: true },
	{ key: 'phonePrimary', category: 'contact', type: 'string', description: 'Primary phone number' },
	{ key: 'phoneTurkey', category: 'contact', type: 'string', description: 'Turkey phone number' },
	{ key: 'phoneSweden', category: 'contact', type: 'string', description: 'Sweden phone number' },
	{ key: 'location', category: 'contact', type: 'string', description: 'Current / multi-location descriptor' },
	{ key: 'heroGreeting', category: 'hero', type: 'string', description: 'Hero section greeting line' },
	{ key: 'heroSubtitle', category: 'hero', type: 'string', description: 'Hero subtitle / skill summary' },
	{ key: 'heroDescription', category: 'hero', type: 'string', description: 'Longer hero body description' }
];
