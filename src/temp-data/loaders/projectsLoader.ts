import { portfolio, findProject, featuredProjects, nonFeaturedProjects } from '../portfolio';

export const allProjects = async () => portfolio;
export const projectBySlug = async (slug: string) => findProject(slug);
export const featured = async () => featuredProjects;
export const others = async () => nonFeaturedProjects;
