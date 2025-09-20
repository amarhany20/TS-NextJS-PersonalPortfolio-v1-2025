import type { Certificate } from '@/types/database';
import { credentials } from '../credentials';

// Map friendly slug => actual filename inside /localdata/attachments
// Filenames kept exactly as on disk (with spaces & punctuation) for direct linking.
const attachmentFileMap: Record<string, string> = {
  'animals-ai-internship-certificate': '2023-10 Animals.ai Internship Certificate.pdf',
  'go-the-complete-guide': '2025-03-06 Go - The Complete Guide UC-d9e09f02-5a94-492b-8f9c-dff51cda8a02.pdf',
  'python-course-certificate': 'Ammar Hany Python Course Certificate - UC-9615c4dd-a278-45ab-800f-78eeb80e5e66.pdf',
  'teknofest-2023-participation-autonomous-harvesting-robot-top-25': 'Ammar Hany Teknofest Certificate.pdf',
  'animals-ai-recommendation-letter': 'Animals.ai Recommendation Letter (Ammar - Yuan) signed.pdf',
  'self-driving-car-certificate': 'Self-Driving Car Certificate UC-b28c626f-132b-4ff3-bea9-89e33052f24a.pdf',
};

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/udemy:\s*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const certificates = async (): Promise<Certificate[]> => {
  const items = credentials
    .filter(c => c.type === 'certificate' || c.type === 'award')
    .map((c, idx) => {
      const slug = toSlug(c.title);
      // Prefer mapped filename; fall back to heuristic based on slug
      const filename = attachmentFileMap[slug];
      const verifyUrl = filename
        ? `/attachments/${encodeURIComponent(filename)}`
        : `/attachments/${encodeURIComponent(c.title)}.pdf`;
      return {
        id: idx + 1,
        name: c.title,
        issuer: c.issuer || (c.type === 'award' ? 'Award' : 'Udemy'),
        date: c.year ? `${c.year}-01-01` : new Date().toISOString().slice(0,10),
        credential: slug,
        description: c.description || '',
        skills: c.tags ? [...c.tags] : [],
        image: null,
        verifyUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

  // Sort newest first by date string (YYYY-MM-DD lexicographic sorts correctly)
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return items;
};
