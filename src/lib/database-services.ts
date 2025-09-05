import { prisma } from "@/lib/database";
import type { Experience, Education, Skill, Certificate, Recommendation, Service, Language, BlogPost, Project, Metadata, CVInfo } from "@prisma/client";

// Metadata-driven Personal Information Service
export const getPersonalInfo = async () => {
  const personalMetadata = await prisma.metadata.findMany({
    where: {
      category: "personal",
      isActive: true,
    },
  });

  // Transform metadata array into a structured object
  const personalInfo: Record<string, string | number | boolean | object> = {};

  personalMetadata.forEach((meta) => {
    try {
      if (meta.type === "json") {
        personalInfo[meta.key] = JSON.parse(meta.value);
      } else if (meta.type === "number") {
        personalInfo[meta.key] = Number(meta.value);
      } else if (meta.type === "boolean") {
        personalInfo[meta.key] = meta.value === "true";
      } else {
        personalInfo[meta.key] = meta.value;
      }
    } catch (error) {
      console.error(`Error parsing metadata for key ${meta.key}:`, error);
      personalInfo[meta.key] = meta.value; // Fallback to raw value
    }
  });

  return Object.keys(personalInfo).length > 0 ? personalInfo : null;
};

// Get specific personal metadata by key
export const getPersonalMetadata = async (key: string) => {
  const metadata = await prisma.metadata.findUnique({
    where: { key },
  });

  if (!metadata?.isActive) return null;

  try {
    if (metadata.type === "json") {
      return JSON.parse(metadata.value);
    } else if (metadata.type === "number") {
      return Number(metadata.value);
    } else if (metadata.type === "boolean") {
      return metadata.value === "true";
    } else {
      return metadata.value;
    }
  } catch (error) {
    console.error(`Error parsing metadata for key ${key}:`, error);
    return metadata.value; // Fallback to raw value
  }
};

// Hero Content Service
type HeroContentShape = {
  greeting: string;
  subtitle: string;
  description: string;
  callToAction: string;
  primaryButton: { text: string; href: string };
  secondaryButton: { text: string; href: string };
};

export const getHeroContent = async (): Promise<HeroContentShape | null> => {
  const heroMetadata = await prisma.metadata.findMany({
    where: {
      category: "hero",
      isActive: true,
    },
  });

  if (!heroMetadata.length) return null;

  // Transform metadata array into a structured object with proper key mapping
  const heroContent: Partial<HeroContentShape> = {};
  heroMetadata.forEach((meta) => {
    try {
      let processedValue;
      if (meta.type === "json") {
        processedValue = JSON.parse(meta.value);
      } else if (meta.type === "number") {
        processedValue = Number(meta.value);
      } else if (meta.type === "boolean") {
        processedValue = meta.value === "true";
      } else {
        processedValue = meta.value;
      }

      // Map database keys to component expected keys
      const keyMapping: Record<string, string> = {
        heroGreeting: "greeting",
        heroSubtitle: "subtitle",
        heroDescription: "description",
        heroCallToAction: "callToAction",
        heroPrimaryButton: "primaryButton",
        heroSecondaryButton: "secondaryButton",
      };

      const mappedKey = (keyMapping[meta.key] || meta.key) as keyof HeroContentShape;
      if (mappedKey === "primaryButton" || mappedKey === "secondaryButton") {
        const btn = processedValue as unknown;
        const isBtn = (b: unknown): b is { text: unknown; href: unknown } => typeof b === "object" && b !== null && "text" in (b as Record<string, unknown>) && "href" in (b as Record<string, unknown>);
        const text = isBtn(btn) && typeof btn.text === "string" ? btn.text : "";
        const href = isBtn(btn) && typeof btn.href === "string" ? btn.href : "#";
        heroContent[mappedKey] = { text, href };
      } else if (mappedKey === "greeting" || mappedKey === "subtitle" || mappedKey === "description" || mappedKey === "callToAction") {
        heroContent[mappedKey] = String(processedValue) as HeroContentShape[typeof mappedKey];
      }
    } catch (error) {
      console.error(`Error parsing hero metadata for key ${meta.key}:`, error);
      const keyMapping: Record<string, keyof HeroContentShape> = {
        heroGreeting: "greeting",
        heroSubtitle: "subtitle",
        heroDescription: "description",
        heroCallToAction: "callToAction",
        heroPrimaryButton: "primaryButton",
        heroSecondaryButton: "secondaryButton",
      };
      const mappedKey = keyMapping[meta.key];
      if (mappedKey === "primaryButton" || mappedKey === "secondaryButton") {
        heroContent[mappedKey] = { text: "", href: "#" };
      } else if (mappedKey) {
        heroContent[mappedKey] = String(meta.value) as HeroContentShape[typeof mappedKey];
      }
    }
  });

  // Provide sensible fallbacks if any field missing
  return {
    greeting: heroContent.greeting || "",
    subtitle: heroContent.subtitle || "",
    description: heroContent.description || "",
    callToAction: heroContent.callToAction || "",
    primaryButton: heroContent.primaryButton || { text: "", href: "#" },
    secondaryButton: heroContent.secondaryButton || { text: "", href: "#" },
  };
};

// Contact Information Service
export const getContactInfo = async (): Promise<Record<string, unknown> | null> => {
  const contactMetadata = await prisma.metadata.findMany({
    where: {
      category: "contact",
      isActive: true,
    },
  });

  if (!contactMetadata.length) return null;

  // Transform metadata array into a structured object
  const contactInfo: Record<string, unknown> = {};
  contactMetadata.forEach((meta) => {
    try {
      if (meta.type === "json") {
        contactInfo[meta.key] = JSON.parse(meta.value);
      } else if (meta.type === "number") {
        contactInfo[meta.key] = Number(meta.value);
      } else if (meta.type === "boolean") {
        contactInfo[meta.key] = meta.value === "true";
      } else {
        contactInfo[meta.key] = meta.value;
      }
    } catch (error) {
      console.error(`Error parsing contact metadata for key ${meta.key}:`, error);
      contactInfo[meta.key] = meta.value;
    }
  });

  return contactInfo;
};

// Work Experience Service
export const getExperience = async (): Promise<Experience[]> => {
  const experiences = await prisma.experience.findMany({
    orderBy: { createdAt: "desc" },
  });

  return experiences.map((exp) => ({
    ...exp,
    achievements: JSON.parse(exp.achievements),
    skills: JSON.parse(exp.skills),
  }));
};

// Education Service
export const getEducation = async (): Promise<Education[]> => {
  const education = await prisma.education.findMany({
    orderBy: { createdAt: "desc" },
  });

  return education.map((edu) => ({
    ...edu,
    achievements: JSON.parse(edu.achievements),
    courses: JSON.parse(edu.courses),
  }));
};

// Skills Service
export const getSkills = async (): Promise<Record<string, { title: string; icon: string; skills: Skill[] }>> => {
  const skillCategories = await prisma.skillCategory.findMany({
    include: {
      skills: {
        orderBy: { level: "desc" },
      },
    },
  });

  return skillCategories.reduce((acc, category) => {
    acc[category.name] = {
      title: category.title,
      icon: category.icon,
      skills: category.skills,
    };
    return acc;
  }, {} as Record<string, { title: string; icon: string; skills: Skill[] }>);
};

export const getCoreSkills = async (): Promise<Skill[]> => {
  const coreSkills = await prisma.skill.findMany({
    where: {
      isCoreSkill: true,
      isActive: true,
    },
    include: {
      category: true,
    },
    orderBy: { displayOrder: "asc" },
  });

  return coreSkills;
};

// Certificates Service
export const getCertificates = async (): Promise<Certificate[]> => {
  const certificates = await prisma.certificate.findMany({
    orderBy: { createdAt: "desc" },
  });

  return certificates.map((cert) => ({
    ...cert,
    skills: JSON.parse(cert.skills),
  }));
};

// Recommendations Service
export const getRecommendations = async (): Promise<Recommendation[]> => {
  return await prisma.recommendation.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// Services Service
export const getServices = async (): Promise<Service[]> => {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });

  return services.map((service) => ({
    ...service,
    features: JSON.parse(service.features),
    technologies: JSON.parse(service.technologies),
    pricing: JSON.parse(service.pricing),
  }));
};

// Languages Service
export const getLanguages = async (): Promise<Language[]> => {
  return await prisma.language.findMany({
    orderBy: { proficiency: "desc" },
  });
};

// Blog Posts Service
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const blogPosts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return blogPosts.map((post) => ({
    ...post,
    tags: JSON.parse(post.tags),
  }));
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  const blogPost = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!blogPost) return null;

  return {
    ...blogPost,
    tags: JSON.parse(blogPost.tags),
  };
};

// Projects Service (placeholder for future use)
export const getProjects = async (): Promise<Project[]> => {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return projects.map((project) => ({
    ...project,
    gallery: JSON.parse(project.gallery),
    technologies: JSON.parse(project.technologies),
    features: JSON.parse(project.features),
  }));
};

// Metadata Service
export const getMetadata = async (key: string): Promise<unknown> => {
  const metadata = await prisma.metadata.findUnique({
    where: { key },
  });

  if (!metadata) return null;

  try {
    if (metadata.type === "json") {
      return JSON.parse(metadata.value);
    } else if (metadata.type === "number") {
      return Number(metadata.value);
    } else if (metadata.type === "boolean") {
      return metadata.value === "true";
    }
    return metadata.value;
  } catch (error) {
    console.error(`Error parsing metadata for key ${key}:`, error);
    return metadata.value;
  }
};

export const getMetadataByCategory = async (category: string): Promise<Record<string, unknown>> => {
  const metadataList = await prisma.metadata.findMany({
    where: { category },
  });

  const result: Record<string, unknown> = {};
  metadataList.forEach((metadata: Metadata) => {
    try {
      if (metadata.type === "json") {
        result[metadata.key] = JSON.parse(metadata.value);
      } else if (metadata.type === "number") {
        result[metadata.key] = Number(metadata.value);
      } else if (metadata.type === "boolean") {
        result[metadata.key] = metadata.value === "true";
      } else {
        result[metadata.key] = metadata.value;
      }
    } catch (error) {
      console.error(`Error parsing metadata for key ${metadata.key}:`, error);
      result[metadata.key] = metadata.value;
    }
  });

  return result;
};

// Social Links Service (using metadata)
export const getSocialLinks = async (): Promise<Record<string, unknown> | null> => {
  const socialMetadata = await prisma.metadata.findMany({
    where: {
      category: "social",
      isActive: true,
    },
  });

  if (!socialMetadata.length) return null;

  // Transform metadata array into a structured object
  const socialLinks: Record<string, unknown> = {};
  socialMetadata.forEach((meta) => {
    try {
      if (meta.type === "json") {
        socialLinks[meta.key] = JSON.parse(meta.value);
      } else {
        socialLinks[meta.key] = meta.value;
      }
    } catch (error) {
      console.error(`Error parsing social metadata for key ${meta.key}:`, error);
      socialLinks[meta.key] = meta.value;
    }
  });

  return socialLinks;
};

// CV Info Service
export const getCVInfo = async (): Promise<CVInfo | null> => {
  return await prisma.cVInfo.findFirst();
};
