// Static data hooks (no network). Centralized here (formerly useApiData).
import { useState, useEffect } from 'react';
import { personalInfo, heroContent, contactInfo } from '@/temp-data/loaders/personal';
import { experience } from '@/temp-data/loaders/experienceLoader';
import { education } from '@/temp-data/loaders/educationLoader';
import { allSkills, coreSkills } from '@/temp-data/loaders/skillsLoader';
import { certificates } from '@/temp-data/loaders/certificatesLoader';
import { recommendations } from '@/temp-data/loaders/recommendationsLoader';
import { services } from '@/temp-data/loaders/servicesLoader';
import { languages } from '@/temp-data/loaders/languagesLoader';

interface StaticState<T> { data: T | null; loading: boolean; error: string | null }

function useStaticAsync<T>(loader: () => Promise<T>): StaticState<T> {
	const [state, setState] = useState<StaticState<T>>({ data: null, loading: true, error: null });
	useEffect(() => {
		let mounted = true;
		loader()
			.then(d => mounted && setState({ data: d, loading: false, error: null }))
			.catch(e => mounted && setState({ data: null, loading: false, error: e instanceof Error ? e.message : 'Error' }));
		return () => { mounted = false; };
	}, [loader]);
	return state;
}

export const useExperience = () => useStaticAsync(experience);
export const useEducation = () => useStaticAsync(education);
export const useSkills = () => useStaticAsync(allSkills);
export const useCoreSkills = () => useStaticAsync(coreSkills);
export const useCertificates = () => useStaticAsync(certificates);
export const useRecommendations = () => useStaticAsync(recommendations);
export const useServices = () => useStaticAsync(services);
export const useLanguages = () => useStaticAsync(languages);
export const usePersonalInfo = () => useStaticAsync(personalInfo);
export const useHeroContent = () => useStaticAsync(heroContent);
export const useContactInfo = () => useStaticAsync(contactInfo);

export const useProfileData = () => {
	const pi = usePersonalInfo();
	const cs = useCoreSkills();
	const ls = useLanguages();
	return {
		personalInfo: pi.data,
		coreSkills: cs.data,
		languages: ls.data,
		loading: pi.loading || cs.loading || ls.loading,
		error: pi.error || cs.error || ls.error,
	};
};

export const useHomePageData = () => {
	const exp = useExperience();
	const edu = useEducation();
	const sk = useSkills();
	const cert = useCertificates();
	const rec = useRecommendations();
	return {
		experience: exp.data,
		education: edu.data,
		skills: sk.data,
		certificates: cert.data,
		recommendations: rec.data,
		loading: exp.loading || edu.loading || sk.loading || cert.loading || rec.loading,
		error: exp.error || edu.error || sk.error || cert.error || rec.error,
	};
};

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
