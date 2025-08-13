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
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseURL}/api${endpoint}`;
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

      if (!data.success) {
        throw new Error(data.message || data.error || "API request failed");
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        throw error;
      }

      throw new Error("Unknown error occurred");
    }
  }

  // GET request with caching
  async get<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    const cacheKey = `api_cache_${endpoint}`;

    if (useCache && typeof window !== "undefined") {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached);
          const now = Date.now();
          const cacheAge = now - parsedCache.timestamp;

          // Cache valid for 5 minutes
          if (cacheAge < 5 * 60 * 1000) {
            return parsedCache.data;
          }
        } catch {
          sessionStorage.removeItem(cacheKey);
        }
      }
    }

    const response = await this.request<T>(endpoint, { method: "GET" });

    // Cache the response
    if (useCache && typeof window !== "undefined") {
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({
          data: response,
          timestamp: Date.now(),
        })
      );
    }

    return response;
  }

  // POST request
  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
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
  // Personal Info
  getPersonalInfo: () => apiClient.get<ApiResponse<Record<string, string | number | boolean | object>>>("/personal-info"),

  // Experience
  getExperience: () => apiClient.get<ApiResponse<Experience[]>>("/experience"),

  // Education
  getEducation: () => apiClient.get<ApiResponse<Education[]>>("/education"),

  // Skills
  getSkills: () => apiClient.get<ApiResponse<Record<string, { title: string; icon: string; skills: Skill[] }>>>("/skills"),

  // Core Skills
  getCoreSkills: () => apiClient.get<ApiResponse<string[]>>("/core-skills"),

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
