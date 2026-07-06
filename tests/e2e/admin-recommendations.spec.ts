import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin recommendations CRUD', () => {
  test('creates, publishes, edits, and deletes a recommendation', async ({ request }) => {
    const unique = Date.now();
    const name = `E2E Recommender ${unique}`;
    let recommendation: { id: string } | null = null;

    try {
      recommendation = await createRecommendation(request, {
        name,
        position: 'CTO',
        company: 'E2E Corp',
        content: 'Automation smoke coverage for recommendations.',
        rating: 5,
      });

      await expect.poll(async () => {
        const record = await getRecommendation(request, recommendation.id);
        return record?.id === recommendation.id;
      }, { timeout: 15000 }).toBe(true);

      await publishRecommendation(request, recommendation.id);
      await expect.poll(async () => {
        const record = await getRecommendation(request, recommendation.id);
        return record?.published ?? false;
      }, { timeout: 15000 }).toBe(true);

      await updateRecommendation(request, recommendation.id, {
        content: 'Automation smoke coverage for recommendations (edited).',
      });

      await expect.poll(async () => {
        const record = await getRecommendation(request, recommendation.id);
        return record?.content;
      }, { timeout: 15000 }).toBe('Automation smoke coverage for recommendations (edited).');

      await deleteRecommendation(request, recommendation.id);
      await expect.poll(async () => {
        const response = await request.get(`/api/v1/recommendations/${recommendation.id}`);
        return response.status();
      }, { timeout: 15000 }).toBe(404);
    } finally {
      await cleanupRecommendation(name, request);
    }
  });
});

async function createRecommendation(request: APIRequestContext, payload: {
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
}) {
  const response = await request.post('/api/v1/recommendations', { data: payload });
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();

  const body = await response.json();
  return body.data.recommendation as { id: string };
}

async function publishRecommendation(request: APIRequestContext, id: string) {
  const response = await request.patch(`/api/v1/recommendations/${id}`, { data: { published: true } });
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function updateRecommendation(request: APIRequestContext, id: string, payload: { content: string }) {
  const response = await request.patch(`/api/v1/recommendations/${id}`, { data: payload });
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function deleteRecommendation(request: APIRequestContext, id: string) {
  const response = await request.delete(`/api/v1/recommendations/${id}`);
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function getRecommendation(request: APIRequestContext, id: string) {
  const response = await request.get(`/api/v1/recommendations/${id}`);
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();

  const body = await response.json();
  return body.data.recommendation as { id: string; published?: boolean; content?: string };
}

async function cleanupRecommendation(name: string, request: APIRequestContext) {
  const listResponse = await request.get('/api/v1/recommendations').catch(() => null);
  if (!listResponse?.ok()) return;

  const payload = (await listResponse.json().catch(() => null)) as any;
  const recommendations = (payload?.data?.recommendations ?? []) as Array<{ id: string; name: string }>;
  const match = recommendations.find((item) => item.name === name);
  if (!match) return;

  const deleteResponse = await request.delete(`/api/v1/recommendations/${match.id}`).catch(() => null);
  if (!deleteResponse) return;
  const responseText = deleteResponse.ok() || deleteResponse.status() === 404 ? '' : await deleteResponse.text();
  if (deleteResponse.ok() || deleteResponse.status() === 404) return;

  console.warn(`Cleanup failed for recommendation ${match.id}: ${deleteResponse.status()} ${responseText}`);
}
