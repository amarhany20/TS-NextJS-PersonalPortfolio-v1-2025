/**
 * Custom React Hooks for API Data Fetching
 * Provides loading states, error handling, and caching
 */

import { useState, useEffect } from "react";
import { apiService } from "@/lib/api-client";
import type { Experience, Education, Skill, Certificate, Recommendation, Service, Language } from "@/types/database";

// Generic hook state
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Specific hooks for each data type - this avoids the dependency loop issue
export const usePersonalInfo = (): UseApiState<Record<string, string | number | boolean | object>> => {
  const [data, setData] = useState<Record<string, string | number | boolean | object> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPersonalInfo();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Only run once on mount

  return { data, loading, error, refetch: fetchData };
};

export const useExperience = (): UseApiState<Experience[]> => {
  const [data, setData] = useState<Experience[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getExperience();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const useEducation = (): UseApiState<Education[]> => {
  const [data, setData] = useState<Education[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getEducation();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const useSkills = (): UseApiState<Record<string, { title: string; icon: string; skills: Skill[] }>> => {
  const [data, setData] = useState<Record<string, { title: string; icon: string; skills: Skill[] }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getSkills();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const useCoreSkills = (): UseApiState<Skill[]> => {
  const [data, setData] = useState<Skill[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCoreSkills();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const useLanguages = (): UseApiState<Language[]> => {
  const [data, setData] = useState<Language[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getLanguages();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const useCertificates = (): UseApiState<Certificate[]> => {
  const [data, setData] = useState<Certificate[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCertificates();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const useRecommendations = (): UseApiState<Recommendation[]> => {
  const [data, setData] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getRecommendations();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export const useServices = (): UseApiState<Service[]> => {
  const [data, setData] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getServices();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

// Combined hook for ProfileSidebar data
export const useProfileData = () => {
  const personalInfo = usePersonalInfo();
  const coreSkills = useCoreSkills();
  const languages = useLanguages();

  return {
    personalInfo: personalInfo.data,
    coreSkills: coreSkills.data,
    languages: languages.data,
    loading: personalInfo.loading || coreSkills.loading || languages.loading,
    error: personalInfo.error || coreSkills.error || languages.error,
    refetch: async () => {
      await Promise.all([personalInfo.refetch(), coreSkills.refetch(), languages.refetch()]);
    },
  };
};

// Hook for homepage data
export const useHomePageData = () => {
  const experience = useExperience();
  const education = useEducation();
  const skills = useSkills();
  const certificates = useCertificates();
  const recommendations = useRecommendations();

  return {
    experience: experience.data,
    education: education.data,
    skills: skills.data,
    certificates: certificates.data,
    recommendations: recommendations.data,
    loading: experience.loading || education.loading || skills.loading || certificates.loading || recommendations.loading,
    error: experience.error || education.error || skills.error || certificates.error || recommendations.error,
    refetch: async () => {
      await Promise.all([experience.refetch(), education.refetch(), skills.refetch(), certificates.refetch(), recommendations.refetch()]);
    },
  };
};

const apiHooks = {
  usePersonalInfo,
  useExperience,
  useEducation,
  useSkills,
  useCoreSkills,
  useLanguages,
  useCertificates,
  useRecommendations,
  useServices,
  useProfileData,
  useHomePageData,
};

export default apiHooks;
