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
