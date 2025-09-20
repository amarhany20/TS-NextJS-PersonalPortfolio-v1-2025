import { portfolio, findProject } from '../portfolio';

export const allProjects = async () => portfolio;
export const projectBySlug = async (slug: string) => findProject(slug);
