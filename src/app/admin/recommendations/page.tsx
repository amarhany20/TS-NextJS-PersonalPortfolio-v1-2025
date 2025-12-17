import type { Metadata } from 'next';

import { RecommendationsManager } from '@/components/Admin/Recommendations/RecommendationsManager';
import { RecommendationService } from '@/server/services/RecommendationService';

export const metadata: Metadata = {
  title: 'Recommendations | Admin',
};

export default async function AdminRecommendationsPage() {
  const recommendations = await RecommendationService.getAllRecommendations();

  return <RecommendationsManager initialRecommendations={recommendations} />;
}
