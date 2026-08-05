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

  test('draft and private portfolio projects are not publicly viewable', async ({ request }) => {
    const unique = Date.now();
    const draftSlug = `e2e-draft-project-${unique}`;
    const privateSlug = `e2e-private-project-${unique}`;

    try {
      const draftResponse = await request.post('/api/v1/portfolio', {
        data: {
          title: `Draft Project ${unique}`,
          slug: draftSlug,
          tagline: 'Draft coverage',
          intro: 'Draft intro',
          summary: 'Draft summary',
          role: 'Automation Engineer',
          visibility: 'public',
          access: 'client-owned',
          status: 'planning',
          start: formatYearMonth(new Date()),
          stack: ['Next.js'],
          published: false,
        },
      });
      expect(draftResponse.ok()).toBeTruthy();

      const privateResponse = await request.post('/api/v1/portfolio', {
        data: {
          title: `Private Project ${unique}`,
          slug: privateSlug,
          tagline: 'Private coverage',
          intro: 'Private intro',
          summary: 'Private summary',
          role: 'Automation Engineer',
          visibility: 'private',
          access: 'client-owned',
          status: 'live',
          start: formatYearMonth(new Date()),
          stack: ['Next.js'],
          published: true,
        },
      });
      expect(privateResponse.ok()).toBeTruthy();

      for (const slug of [draftSlug, privateSlug]) {
        const response = await request.get(`/portfolio/${slug}`);
        expect(response.status(), `${slug} should be hidden from the public site`).toBe(404);
      }
    } finally {
      await cleanupProject(request, draftSlug);
      await cleanupProject(request, privateSlug);
    }
  });

  test('feeds exclude items when their page is hidden via visibility', async ({ request }) => {
    const unique = Date.now();
    const slug = `e2e-hidden-feed-post-${unique}`;

    const visibilityWithBlogs = (blogs: boolean) => ({
      pages: { portfolio: true, services: true, blogs },
      sections: {
        summary: true,
        experience: true,
        education: true,
        certificates: true,
        recommendations: true,
        skills: true,
        contact: true,
      },
    });

    try {
      await createPost(request, { title: `Hidden Feed Post ${unique}`, slug });

      const before = await request.get('/feed.json');
      const beforeJson = await before.json();
      expect(
        beforeJson.items?.some((item: { url?: string }) => item.url?.includes(slug)),
        'post should appear in the feed while the blog page is visible',
      ).toBeTruthy();

      await request.patch('/api/v1/settings/visibility', {
        data: visibilityWithBlogs(false),
      });

      await expect(async () => {
        const after = await request.get('/feed.json');
        const afterJson = await after.json();
        expect(
          afterJson.items?.some((item: { url?: string }) => item.url?.includes(slug)),
          'post must be excluded from the feed when the blog page is hidden',
        ).toBeFalsy();
      }).toPass({ timeout: 20000 });

      await request.patch('/api/v1/settings/visibility', {
        data: visibilityWithBlogs(true),
      });
    } finally {
      await request.patch('/api/v1/settings/visibility', {
        data: visibilityWithBlogs(true),
      });
      await cleanupPost(request, slug);
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
