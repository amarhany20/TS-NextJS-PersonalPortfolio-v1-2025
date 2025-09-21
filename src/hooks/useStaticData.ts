// Simplified static data hooks (direct synchronous access) replacing async loader pattern.
import { experience, education, allSkills, coreSkills, certificates, recommendations, services, personalInfo, heroContent, contactInfo, metadata } from '@/temp-data';

export const useExperience = () => experience;
export const useEducation = () => education;
export const useSkills = () => allSkills;
export const useCoreSkills = () => coreSkills;
export const useCertificates = () => certificates;
export const useRecommendations = () => recommendations;
export const useServices = () => services;
export const usePersonalInfo = () => personalInfo;
export const useHeroContent = () => heroContent;
export const useContactInfo = () => contactInfo;
export const useLanguages = () => metadata.languages;

export const useProfileData = () => ({
  personalInfo,
  coreSkills,
  languages: metadata.languages,
});

export const useHomePageData = () => ({
  experience,
  education,
  skills: allSkills,
  certificates,
  recommendations,
});

const useStaticData = {
  useExperience,
  useEducation,
  useSkills,
  useCoreSkills,
  useCertificates,
  useRecommendations,
  useServices,
  useLanguages,
  usePersonalInfo,
  useHeroContent,
  useContactInfo,
  useProfileData,
  useHomePageData,
};

export default useStaticData;
