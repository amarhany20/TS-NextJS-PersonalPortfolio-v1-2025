import { prisma } from "@/lib/database";
import type { HeroContent, ContactInfo, Experience, Education, Skill, Certificate, Recommendation, Service, Language, BlogPost, Project, Metadata, CVInfo, SocialLinks } from "@/types/database";

// ===============================
// ENHANCED DATABASE SERVICES
// ===============================

// Cache interface for better performance
interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class DatabaseCache {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: unknown, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// Global cache instance
const dbCache = new DatabaseCache();

// ===============================
// CORE INFORMATION SERVICES
// ===============================

export const getPersonalInfo = async () => {
  const cacheKey = "personal_info";
  const cached = dbCache.get(cacheKey) as Record<string, string | number | boolean | object> | null;
  if (cached) return cached;

  try {
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

    const result = Object.keys(personalInfo).length > 0 ? personalInfo : null;

    dbCache.set(cacheKey, result, 10 * 60 * 1000); // 10 minutes cache
    return result;
  } catch (error) {
    console.error("Error fetching personal info:", error);
    return null;
  }
};

export const getHeroContent = async (): Promise<HeroContent | null> => {
  const cacheKey = "hero_content";
  const cached = dbCache.get(cacheKey) as HeroContent | null;
  if (cached) return cached;

  try {
    const heroContent = await prisma.heroContent.findFirst();
    if (!heroContent) return null;

    const result: HeroContent = {
      ...heroContent,
      primaryButton: JSON.parse(heroContent.primaryButton),
      secondaryButton: JSON.parse(heroContent.secondaryButton),
    };

    dbCache.set(cacheKey, result, 15 * 60 * 1000); // 15 minutes cache
    return result;
  } catch (error) {
    console.error("Error fetching hero content:", error);
    return null;
  }
};

export const getContactInfo = async (): Promise<ContactInfo | null> => {
  const cacheKey = "contact_info";
  const cached = dbCache.get(cacheKey) as ContactInfo | null;
  if (cached) return cached;

  try {
    const contactInfo = await prisma.contactInfo.findFirst();
    if (contactInfo) {
      dbCache.set(cacheKey, contactInfo, 10 * 60 * 1000); // 10 minutes cache
    }
    return contactInfo;
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return null;
  }
};

// ===============================
// EXPERIENCE & EDUCATION SERVICES
// ===============================

export const getExperience = async (): Promise<Experience[]> => {
  const cacheKey = "experience";
  const cached = dbCache.get(cacheKey) as Experience[] | null;
  if (cached) return cached;

  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    const result = experiences.map((exp) => ({
      ...exp,
      achievements: JSON.parse(exp.achievements),
      skills: JSON.parse(exp.skills),
    }));

    dbCache.set(cacheKey, result, 8 * 60 * 1000); // 8 minutes cache
    return result;
  } catch (error) {
    console.error("Error fetching experience:", error);
    return [];
  }
};

export const getEducation = async (): Promise<Education[]> => {
  const cacheKey = "education";
  const cached = dbCache.get(cacheKey) as Education[] | null;
  if (cached) return cached;

  try {
    const education = await prisma.education.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    const result = education.map((edu) => ({
      ...edu,
      achievements: JSON.parse(edu.achievements),
      courses: JSON.parse(edu.courses),
    }));

    dbCache.set(cacheKey, result, 8 * 60 * 1000); // 8 minutes cache
    return result;
  } catch (error) {
    console.error("Error fetching education:", error);
    return [];
  }
};

// ===============================
// SKILLS SERVICES
// ===============================

export const getSkills = async (): Promise<Record<string, { title: string; icon: string; skills: Skill[] }>> => {
  const cacheKey = "skills";
  const cached = dbCache.get(cacheKey) as Record<string, { title: string; icon: string; skills: Skill[] }> | null;
  if (cached) return cached;

  try {
    const skillCategories = await prisma.skillCategory.findMany({
      include: {
        skills: {
          orderBy: [{ level: "desc" }, { name: "asc" }],
        },
      },
      orderBy: { name: "asc" },
    });

    const result = skillCategories.reduce((acc, category) => {
      acc[category.name] = {
        title: category.title,
        icon: category.icon,
        skills: category.skills,
      };
      return acc;
    }, {} as Record<string, { title: string; icon: string; skills: Skill[] }>);

    dbCache.set(cacheKey, result, 6 * 60 * 1000); // 6 minutes cache
    return result;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return {};
  }
};

export const getCoreSkills = async (): Promise<string[]> => {
  const cacheKey = "core_skills";
  const cached = dbCache.get(cacheKey) as string[] | null;
  if (cached) return cached;

  try {
    const coreSkills = await prisma.coreSkill.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    const result = coreSkills.map((skill) => skill.name);
    dbCache.set(cacheKey, result, 10 * 60 * 1000); // 10 minutes cache
    return result;
  } catch (error) {
    console.error("Error fetching core skills:", error);
    return [];
  }
};

// ===============================
// CERTIFICATES & RECOMMENDATIONS
// ===============================

export const getCertificates = async (): Promise<Certificate[]> => {
  const cacheKey = "certificates";
  const cached = dbCache.get(cacheKey) as Certificate[] | null;
  if (cached) return cached;

  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    });

    const result = certificates.map((cert) => ({
      ...cert,
      skills: JSON.parse(cert.skills),
    }));

    dbCache.set(cacheKey, result, 12 * 60 * 1000); // 12 minutes cache
    return result;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
};

export const getRecommendations = async (): Promise<Recommendation[]> => {
  const cacheKey = "recommendations";
  const cached = dbCache.get(cacheKey) as Recommendation[] | null;
  if (cached) return cached;

  try {
    const recommendations = await prisma.recommendation.findMany({
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    });

    dbCache.set(cacheKey, recommendations, 15 * 60 * 1000); // 15 minutes cache
    return recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

// ===============================
// SERVICES & LANGUAGES
// ===============================

export const getServices = async (): Promise<Service[]> => {
  const cacheKey = "services";
  const cached = dbCache.get(cacheKey) as Service[] | null;
  if (cached) return cached;

  try {
    const services = await prisma.service.findMany({
      orderBy: [{ createdAt: "desc" }, { title: "asc" }],
    });

    const result = services.map((service) => ({
      ...service,
      features: JSON.parse(service.features),
      technologies: JSON.parse(service.technologies),
      pricing: JSON.parse(service.pricing),
    }));

    dbCache.set(cacheKey, result, 10 * 60 * 1000); // 10 minutes cache
    return result;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const getLanguages = async (): Promise<Language[]> => {
  const cacheKey = "languages";
  const cached = dbCache.get(cacheKey) as Language[] | null;
  if (cached) return cached;

  try {
    const languages = await prisma.language.findMany({
      orderBy: [{ proficiency: "desc" }, { name: "asc" }],
    });

    dbCache.set(cacheKey, languages, 15 * 60 * 1000); // 15 minutes cache
    return languages;
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
};

// ===============================
// BLOG SERVICES
// ===============================

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const cacheKey = "blog_posts";
  const cached = dbCache.get(cacheKey) as BlogPost[] | null;
  if (cached) return cached;

  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: "desc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        author: true,
        publishedAt: true,
        category: true,
        tags: true,
        readTime: true,
        viewCount: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        // Exclude content for list view performance
        content: false,
      },
    });

    const result = blogPosts.map((post) => ({
      ...post,
      content: "", // Empty for list view
      tags: JSON.parse(post.tags),
    }));

    dbCache.set(cacheKey, result, 5 * 60 * 1000); // 5 minutes cache
    return result;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  const cacheKey = `blog_post_${slug}`;
  const cached = dbCache.get(cacheKey) as BlogPost | null;
  if (cached) return cached;

  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!blogPost) return null;

    const result: BlogPost = {
      ...blogPost,
      tags: JSON.parse(blogPost.tags),
    };

    // Update view count asynchronously
    prisma.blogPost
      .update({
        where: { slug },
        data: { viewCount: { increment: 1 } },
      })
      .catch((error) => console.error("Error updating view count:", error));

    dbCache.set(cacheKey, result, 8 * 60 * 1000); // 8 minutes cache
    return result;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
};

// ===============================
// PROJECTS SERVICES
// ===============================

export const getProjects = async (): Promise<Project[]> => {
  const cacheKey = "projects";
  const cached = dbCache.get(cacheKey) as Project[] | null;
  if (cached) return cached;

  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ startDate: "desc" }, { title: "asc" }],
    });

    const result = projects.map((project) => ({
      ...project,
      gallery: JSON.parse(project.gallery),
      technologies: JSON.parse(project.technologies),
      features: JSON.parse(project.features),
    }));

    dbCache.set(cacheKey, result, 10 * 60 * 1000); // 10 minutes cache
    return result;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

// ===============================
// METADATA SERVICES
// ===============================

export const getMetadata = async (key: string): Promise<unknown> => {
  const cacheKey = `metadata_${key}`;
  const cached = dbCache.get(cacheKey);
  if (cached !== null) return cached;

  try {
    const metadata = await prisma.metadata.findUnique({
      where: {
        key,
        isActive: true,
      },
    });

    if (!metadata) return null;

    let result: unknown;
    try {
      if (metadata.type === "json") {
        result = JSON.parse(metadata.value);
      } else if (metadata.type === "number") {
        result = Number(metadata.value);
      } else if (metadata.type === "boolean") {
        result = metadata.value === "true";
      } else {
        result = metadata.value;
      }
    } catch (error) {
      console.error(`Error parsing metadata for key ${key}:`, error);
      result = metadata.value;
    }

    dbCache.set(cacheKey, result, 12 * 60 * 1000); // 12 minutes cache
    return result;
  } catch (error) {
    console.error(`Error fetching metadata for key ${key}:`, error);
    return null;
  }
};

export const getMetadataByCategory = async (category: string): Promise<Record<string, unknown>> => {
  const cacheKey = `metadata_category_${category}`;
  const cached = dbCache.get(cacheKey) as Record<string, unknown> | null;
  if (cached) return cached;

  try {
    const metadataList = await prisma.metadata.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { key: "asc" },
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

    dbCache.set(cacheKey, result, 8 * 60 * 1000); // 8 minutes cache
    return result;
  } catch (error) {
    console.error(`Error fetching metadata for category ${category}:`, error);
    return {};
  }
};

// Social Links Service (using metadata)
export const getSocialLinks = async (): Promise<SocialLinks | null> => {
  try {
    const result = await getMetadata("social_links");
    return result as SocialLinks | null;
  } catch (error) {
    console.error("Error fetching social links:", error);
    return null;
  }
};

// ===============================
// CV INFO SERVICES
// ===============================

export const getCVInfo = async (): Promise<CVInfo | null> => {
  const cacheKey = "cv_info";
  const cached = dbCache.get(cacheKey) as CVInfo | null;
  if (cached) return cached;

  try {
    const cvInfo = await prisma.cVInfo.findFirst();
    if (cvInfo) {
      dbCache.set(cacheKey, cvInfo, 20 * 60 * 1000); // 20 minutes cache
    }
    return cvInfo;
  } catch (error) {
    console.error("Error fetching CV info:", error);
    return null;
  }
};

// ===============================
// ANALYTICS SERVICES
// ===============================

export const trackPageView = async (page: string, userAgent?: string, ipAddress?: string, referrer?: string): Promise<void> => {
  try {
    // Create page view record
    await prisma.pageView.create({
      data: {
        page,
        userAgent,
        ipAddress,
        referrer,
      },
    });

    // Update daily analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.siteAnalytics.upsert({
      where: { date: today },
      update: {
        pageViews: { increment: 1 },
      },
      create: {
        date: today,
        pageViews: 1,
        uniqueVisitors: 1,
      },
    });
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
};

export const incrementCVDownloads = async (): Promise<void> => {
  try {
    // Update CV download count
    await prisma.cVInfo.updateMany({
      data: {
        downloadCount: { increment: 1 },
      },
    });

    // Update daily analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.siteAnalytics.upsert({
      where: { date: today },
      update: {
        cvDownloads: { increment: 1 },
      },
      create: {
        date: today,
        pageViews: 0,
        uniqueVisitors: 0,
        cvDownloads: 1,
      },
    });

    // Clear CV info cache to reflect new download count
    dbCache.delete("cv_info");
  } catch (error) {
    console.error("Error incrementing CV downloads:", error);
  }
};

// ===============================
// CACHE MANAGEMENT
// ===============================

export const clearCache = (pattern?: string): void => {
  if (pattern) {
    // Clear specific cache entries matching pattern
    for (const key of dbCache["cache"].keys()) {
      if (key.includes(pattern)) {
        dbCache.delete(key);
      }
    }
  } else {
    // Clear all cache
    dbCache.clear();
  }
};

export const warmupCache = async (): Promise<void> => {
  try {
    console.log("Warming up database cache...");

    // Preload critical data
    await Promise.all([getPersonalInfo(), getHeroContent(), getContactInfo(), getCoreSkills(), getSocialLinks()]);

    console.log("Database cache warmed up successfully");
  } catch (error) {
    console.error("Error warming up cache:", error);
  }
};

// Export cache management for external use
export { dbCache as databaseCache };
