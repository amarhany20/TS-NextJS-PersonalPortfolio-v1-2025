import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

const DEFAULT_START_MONTH = formatYearMonth(new Date());

test.describe('Public content rendering', () => {
  test('renders a published MDX project detail page', async ({ page, request }) => {
    const unique = Date.now();
    const slug = `e2e-public-project-${unique}`;
    const title = `Public Project ${unique}`;
    const mdxMarker = `E2E-MDX-${unique}`;

    try {
      await createProject(request, { title, slug, contentMdx: `## Overview\n\n${mdxMarker}` });

      await page.goto(`/portfolio/${slug}`, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
      await expect(page.getByText(mdxMarker)).toBeVisible();
    } finally {
      await cleanupProject(request, slug);
    }
  });

  test('renders a published blog post detail page', async ({ page, request }) => {
    const unique = Date.now();
    const slug = `e2e-public-post-${unique}`;
    const title = `Public Post ${unique}`;

    try {
      await createPost(request, { title, slug });

      await page.goto(`/blogs/${slug}`, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    } finally {
      await cleanupPost(request, slug);
    }
  });

  test('serves SEO and feed endpoints', async ({ request }) => {
    for (const path of ['/robots.txt', '/sitemap.xml', '/feed.xml', '/feed.json']) {
      const response = await request.get(path);
      expect(response.ok(), `${path} should respond 2xx`).toBeTruthy();
    }
  });
});

async function createProject(
  request: APIRequestContext,
  payload: { title: string; slug: string; contentMdx: string },
) {
  const response = await request.post('/api/v1/portfolio', {
    data: {
      title: payload.title,
      slug: payload.slug,
      tagline: 'Public detail rendering coverage',
      intro: 'E2E intro for public project detail.',
      summary: 'E2E summary for public project detail.',
      role: 'Automation Engineer',
      visibility: 'public',
      access: 'client-owned',
      status: 'live',
      start: DEFAULT_START_MONTH,
      stack: ['Next.js'],
      published: true,
      contentMdx: payload.contentMdx,
    },
  });
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function cleanupProject(request: APIRequestContext, slug: string) {
  if (!slug) return;
  const response = await request.delete(`/api/v1/portfolio/${slug}`);
  if (response.ok() || response.status() === 404) return;
  console.warn(`Cleanup failed for slug ${slug}: ${response.status()}`);
}

async function createPost(request: APIRequestContext, payload: { title: string; slug: string }) {
  const response = await request.post('/api/v1/blogs', {
    data: {
      title: payload.title,
      slug: payload.slug,
      content: '<p>Public blog detail rendering coverage.</p>',
      status: 'published',
    },
  });
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function cleanupPost(request: APIRequestContext, slug: string) {
  if (!slug) return;
  const response = await request.delete(`/api/v1/blogs/${slug}`);
  if (response.ok() || response.status() === 404) return;
  console.warn(`Cleanup failed for slug ${slug}: ${response.status()}`);
}

function formatYearMonth(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
