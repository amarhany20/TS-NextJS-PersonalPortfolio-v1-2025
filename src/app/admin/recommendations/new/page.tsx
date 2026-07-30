import type { Metadata } from 'next';

import { RecommendationForm } from '@/components/Admin/Recommendations/RecommendationForm';

export const metadata: Metadata = {
  title: 'New Recommendation | Admin',
};

export default function AdminRecommendationCreatePage() {
  return <RecommendationForm mode="create" />;
}
