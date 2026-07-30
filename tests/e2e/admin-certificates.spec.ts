import type { APIRequestContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin certificates CRUD', () => {
  test('creates, edits, and deletes a certificate', async ({ page, request }) => {
    const unique = Date.now();
    const name = `E2E Certificate ${unique}`;
    const issuer = `E2E Issuer ${unique}`;
    let certificate: { id: string } | null = null;

    try {
      certificate = await createCertificate(request, {
        name,
        issuer,
        issuedOn: '2025-01-01T00:00:00.000Z',
        credentialId: `CERT-${unique}`,
        description: 'Automation smoke coverage for certificates.',
        skills: ['Quality Assurance', 'Automation'],
      });

      await expect
        .poll(
          async () => {
            const record = await getCertificate(request, certificate!.id);
            return record?.id === certificate!.id;
          },
          { timeout: 15000 },
        )
        .toBe(true);

      await page.goto(`/admin/certificates/${certificate!.id}`, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: new RegExp(`Edit ${name}`) })).toBeVisible();

      await updateCertificate(request, certificate!.id, {
        description: 'Automation smoke coverage for certificates (edited).',
      });

      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.getByLabel(/Description/i)).toHaveValue(
        'Automation smoke coverage for certificates (edited).',
      );

      await deleteCertificate(request, certificate!.id);
      await expect
        .poll(
          async () => {
            const response = await request.get(`/api/v1/certificates/${certificate!.id}`);
            return response.status();
          },
          { timeout: 15000 },
        )
        .toBe(404);
    } finally {
      await cleanupCertificate(name, issuer, request);
    }
  });
});

async function createCertificate(
  request: APIRequestContext,
  payload: {
    name: string;
    issuer: string;
    issuedOn: string;
    credentialId: string;
    description: string;
    skills: string[];
  },
) {
  const response = await request.post('/api/v1/certificates', { data: payload });
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();

  const body = await response.json();
  return body.data.certificate as { id: string };
}

async function updateCertificate(
  request: APIRequestContext,
  id: string,
  payload: { description: string },
) {
  const response = await request.patch(`/api/v1/certificates/${id}`, { data: payload });
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function deleteCertificate(request: APIRequestContext, id: string) {
  const response = await request.delete(`/api/v1/certificates/${id}`);
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();
}

async function getCertificate(request: APIRequestContext, id: string) {
  const response = await request.get(`/api/v1/certificates/${id}`);
  const responseText = response.ok() ? '' : await response.text();
  expect(response.ok(), responseText).toBeTruthy();

  const body = await response.json();
  return body.data.certificate as { id: string };
}

async function cleanupCertificate(name: string, issuer: string, request: APIRequestContext) {
  const listResponse = await request.get('/api/v1/certificates').catch(() => null);
  if (!listResponse?.ok()) return;

  const payload = (await listResponse.json().catch(() => null)) as any;
  const certificates = (payload?.data?.certificates ?? []) as Array<{
    id: string;
    name: string;
    issuer: string;
  }>;
  const match = certificates.find((item) => item.name === name && item.issuer === issuer);
  if (!match) return;

  const deleteResponse = await request.delete(`/api/v1/certificates/${match.id}`).catch(() => null);
  if (!deleteResponse) return;
  const responseText =
    deleteResponse.ok() || deleteResponse.status() === 404 ? '' : await deleteResponse.text();
  if (deleteResponse.ok() || deleteResponse.status() === 404) return;

  console.warn(
    `Cleanup failed for certificate ${match.id}: ${deleteResponse.status()} ${responseText}`,
  );
}
