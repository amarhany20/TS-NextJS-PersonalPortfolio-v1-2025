import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { RecommendationForm } from '@/components/Admin/Recommendations/RecommendationForm';
import { RecommendationService } from '@/server/services/RecommendationService';

interface AdminRecommendationEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const loadRecommendation = cache((id: string) => RecommendationService.getRecommendationById(id));

export async function generateMetadata({
  params,
}: AdminRecommendationEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const recommendation = await loadRecommendation(id);
  return {
    title: recommendation
      ? `Edit ${recommendation.name} | Admin Recommendation`
      : 'Recommendation not found',
  };
}

export default async function AdminRecommendationEditPage({
  params,
}: AdminRecommendationEditPageProps) {
  const { id } = await params;
  const recommendation = await loadRecommendation(id);

  if (!recommendation) {
    notFound();
  }

  return <RecommendationForm mode="edit" recommendation={recommendation} />;
}
