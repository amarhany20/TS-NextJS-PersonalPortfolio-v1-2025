/**
 * API Client Service
 * Centralized API communication with error handling, caching, and retry logic
 */

import type { Experience, Education, Skill, Certificate, Recommendation, Service, Language } from "@/types/database";

// Grouped Skills Type (what getSkills actually returns)
export type GroupedSkills = Record<
  string,
  {
    title: string;
    icon: string;
    skills: Skill[];
  }
>;

// API Response Type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  timestamp: string;
  error?: string;
  message?: string;
}

// API Client Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const DEFAULT_TIMEOUT = 10000;

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = DEFAULT_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();

    // Setup timeout
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Check cache first (only for GET requests)
      if (!options.method || options.method === "GET") {
        const cached = this.getFromCache<T>(endpoint);
        if (cached) return cached;
      }

      const url = endpoint.startsWith("http") ? endpoint : `/api${endpoint}`;

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful GET responses
      if (!options.method || options.method === "GET") {
        this.saveToCache(endpoint, data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        throw error;
      }
      throw new Error("Unknown error occurred");
    }
  }

  // Cache management (session storage, 5 minutes)
  private getFromCache<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    try {
      const cached = sessionStorage.getItem(`api_cache_${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      // Cache for 5 minutes
      if (age < 5 * 60 * 1000) {
        return data;
      }

      sessionStorage.removeItem(`api_cache_${key}`);
      return null;
    } catch {
      return null;
    }
  }

  private saveToCache<T>(key: string, data: T): void {
    if (typeof window === "undefined") return;

    try {
      sessionStorage.setItem(
        `api_cache_${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch {
      // Ignore storage errors
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Clear cache
  clearCache(): void {
    if (typeof window !== "undefined") {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("api_cache_")) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// API Service Functions
export const apiService = {
  // Personal Info - using metadata endpoint with category filter
  getPersonalInfo: () => apiClient.get<ApiResponse<Record<string, string | number | boolean | object>>>("/metadata?category=personal"),

  // Generic metadata helpers
  getMetadataByCategory: (category: string) =>
    apiClient.get<ApiResponse<Record<string, unknown>>>(`/metadata?category=${encodeURIComponent(category)}`),
  getMetadataByKey: (key: string) => apiClient.get<ApiResponse<{ key: string; value: unknown; type: string; category: string; description?: string }>>(`/metadata?key=${encodeURIComponent(key)}`),

  // Experience
  getExperience: () => apiClient.get<ApiResponse<Experience[]>>("/experience"),

  // Education
  getEducation: () => apiClient.get<ApiResponse<Education[]>>("/education"),

  // Skills
  getSkills: () => apiClient.get<ApiResponse<GroupedSkills>>("/skills"),

  // Core Skills - using skills endpoint with core filter
  getCoreSkills: () => apiClient.get<ApiResponse<Skill[]>>("/skills?core=true"),

  // Languages
  getLanguages: () => apiClient.get<ApiResponse<Language[]>>("/languages"),

  // Certificates
  getCertificates: () => apiClient.get<ApiResponse<Certificate[]>>("/certificates"),

  // Recommendations
  getRecommendations: () => apiClient.get<ApiResponse<Recommendation[]>>("/recommendations"),

  // Services
  getServices: () => apiClient.get<ApiResponse<Service[]>>("/services"),

  // Utility
  clearCache: () => apiClient.clearCache(),
};

export default apiService;
