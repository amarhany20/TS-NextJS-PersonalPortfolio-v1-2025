/**
 * Admin Services
 * API service functions for admin CRUD operations
 */

// Base API response types
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Admin Experience interface (matches our admin needs)
export interface AdminExperience {
  id: number;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  projectHighlights: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Personal Info / Metadata Types
export interface PersonalInfoData {
  name: string;
  displayName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedIn?: string;
  github?: string;
  availability: string;
  relocationStatus: string;
  professionalSummary: string;
  careerObjective: string;
}

export interface MetadataItem {
  id: number;
  key: string;
  value: string;
  type: string;
  category: string;
  subcategory?: string;
  description?: string;
  isRequired: boolean;
  isActive: boolean;
}

// Experience Types
export type ExperienceData = Omit<AdminExperience, "id" | "createdAt" | "updatedAt">;

// Placeholder types for other entities (to be implemented later)
type Education = Record<string, unknown>;
type Skill = Record<string, unknown>;
type Certificate = Record<string, unknown>;
type Recommendation = Record<string, unknown>;

// Education Types
export type EducationData = Omit<Education, "id" | "createdAt" | "updatedAt">;

// Skills Types
export type SkillData = Omit<Skill, "id" | "createdAt" | "updatedAt">;

// Skill Category Type
export interface SkillCategory {
  id: number;
  name: string;
  title: string;
  icon: string;
  skills?: Skill[];
}

// Base CRUD Service Class
class BaseAdminService {
  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`/api/admin${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  protected async post<T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  protected async put<T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Personal Info Service
export class PersonalInfoService extends BaseAdminService {
  async getPersonalInfo(): Promise<ApiResponse<PersonalInfoData>> {
    return this.get<PersonalInfoData>("/personal");
  }

  async updatePersonalInfo(data: Partial<PersonalInfoData>): Promise<ApiResponse<PersonalInfoData>> {
    return this.put<PersonalInfoData>("/personal", data);
  }

  async getMetadata(category?: string): Promise<ApiResponse<MetadataItem[]>> {
    const endpoint = category ? `/personal/metadata?category=${category}` : "/personal/metadata";
    return this.get<MetadataItem[]>(endpoint);
  }

  async updateMetadata(key: string, value: string | number | boolean | object, type = "string"): Promise<ApiResponse<MetadataItem>> {
    return this.put<MetadataItem>("/personal/metadata", { key, value, type });
  }

  async createMetadata(data: Omit<MetadataItem, "id">): Promise<ApiResponse<MetadataItem>> {
    return this.post<MetadataItem>("/personal/metadata", data);
  }

  async deleteMetadata(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`/personal/metadata/${id}`);
  }
}

// Experience Service
export class ExperienceService extends BaseAdminService {
  async getExperiences(): Promise<ApiResponse<AdminExperience[]>> {
    return this.get<AdminExperience[]>("/experience");
  }

  async getExperience(id: number): Promise<ApiResponse<AdminExperience>> {
    return this.get<AdminExperience>(`/experience/${id}`);
  }

  async createExperience(data: ExperienceData): Promise<ApiResponse<AdminExperience>> {
    return this.post<AdminExperience>("/experience", data);
  }

  async updateExperience(id: number, data: Partial<ExperienceData>): Promise<ApiResponse<AdminExperience>> {
    return this.put<AdminExperience>(`/experience/${id}`, data);
  }

  async deleteExperience(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`/experience/${id}`);
  }

  async reorderExperiences(orderedIds: number[]): Promise<ApiResponse<AdminExperience[]>> {
    return this.post<AdminExperience[]>("/experience/reorder", { orderedIds });
  }

  // Helper method for reordering single experience
  async reorderExperience(id: number, direction: "up" | "down"): Promise<ApiResponse<void>> {
    return this.post<void>(`/experience/${id}/reorder`, { direction });
  }

  // Get all experiences method (alias)
  async getAllExperience(): Promise<ApiResponse<AdminExperience[]>> {
    return this.getExperiences();
  }
}

// Education Service
export class EducationService extends BaseAdminService {
  async getEducations(): Promise<ApiResponse<Education[]>> {
    return this.get<Education[]>("/education");
  }

  async getEducation(id: number): Promise<ApiResponse<Education>> {
    return this.get<Education>(`/education/${id}`);
  }

  async createEducation(data: EducationData): Promise<ApiResponse<Education>> {
    return this.post<Education>("/education", data);
  }

  async updateEducation(id: number, data: Partial<EducationData>): Promise<ApiResponse<Education>> {
    return this.put<Education>(`/education/${id}`, data);
  }

  async deleteEducation(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`/education/${id}`);
  }
}

// Skills Service
export class SkillsService extends BaseAdminService {
  async getSkills(): Promise<ApiResponse<Skill[]>> {
    return this.get<Skill[]>("/skills");
  }

  async getSkillCategories(): Promise<ApiResponse<SkillCategory[]>> {
    return this.get<SkillCategory[]>("/skills/categories");
  }

  async createSkill(data: SkillData): Promise<ApiResponse<Skill>> {
    return this.post<Skill>("/skills", data);
  }

  async updateSkill(id: number, data: Partial<SkillData>): Promise<ApiResponse<Skill>> {
    return this.put<Skill>(`/skills/${id}`, data);
  }

  async deleteSkill(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`/skills/${id}`);
  }
}

// Certificate Service
export class CertificateService extends BaseAdminService {
  async getCertificates(): Promise<ApiResponse<Certificate[]>> {
    return this.get<Certificate[]>("/certificates");
  }

  async createCertificate(data: Omit<Certificate, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Certificate>> {
    return this.post<Certificate>("/certificates", data);
  }

  async updateCertificate(id: number, data: Partial<Certificate>): Promise<ApiResponse<Certificate>> {
    return this.put<Certificate>(`/certificates/${id}`, data);
  }

  async deleteCertificate(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`/certificates/${id}`);
  }
}

// Recommendation Service
export class RecommendationService extends BaseAdminService {
  async getRecommendations(): Promise<ApiResponse<Recommendation[]>> {
    return this.get<Recommendation[]>("/recommendations");
  }

  async createRecommendation(data: Omit<Recommendation, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Recommendation>> {
    return this.post<Recommendation>("/recommendations", data);
  }

  async updateRecommendation(id: number, data: Partial<Recommendation>): Promise<ApiResponse<Recommendation>> {
    return this.put<Recommendation>(`/recommendations/${id}`, data);
  }

  async deleteRecommendation(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`/recommendations/${id}`);
  }
}

// Export service instances
export const personalInfoService = new PersonalInfoService();
export const experienceService = new ExperienceService();
export const educationService = new EducationService();
export const skillsService = new SkillsService();
export const certificateService = new CertificateService();
export const recommendationService = new RecommendationService();

// Export all services as default object
export const adminServices = {
  personalInfo: personalInfoService,
  experience: experienceService,
  education: educationService,
  skills: skillsService,
  certificates: certificateService,
  recommendations: recommendationService,
};

export default adminServices;
