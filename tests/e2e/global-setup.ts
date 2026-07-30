import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';

import { request, type FullConfig, type APIRequestContext } from '@playwright/test';

const MAX_LOGIN_ATTEMPTS = 5;
const SERVER_READY_TIMEOUT_MS = 60_000;

export default async function globalSetup(config: FullConfig) {
  const projectUse = config.projects[0]?.use ?? {};
  const baseURL =
    (projectUse.baseURL as string | undefined) ??
    process.env.PLAYWRIGHT_ISOLATED_BASE_URL ??
    'http://127.0.0.1:3100';
  const username = (process.env.E2E_ADMIN_USERNAME ?? process.env.SEED_ADMIN_USERNAME ?? 'admin')
    .trim()
    .toLowerCase();
  const password =
    process.env.E2E_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? 'change-me-now';

  const apiContext = await request.newContext({ baseURL });
  let lastError: Error | null = null;

  await waitForServer(apiContext);

  for (let attempt = 1; attempt <= MAX_LOGIN_ATTEMPTS; attempt += 1) {
    try {
      const response = await apiContext.post('/api/v1/auth/login', {
        data: { username, password },
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok()) {
        await persistStorageState(apiContext);
        await apiContext.dispose();
        return;
      }

      const message = await response.text();
      lastError = new Error(`Login failed with status ${response.status()}: ${message}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown login error');
    }

    await delay(500 * attempt);
  }

  await apiContext.dispose();
  throw new Error(
    `Unable to establish admin session for Playwright tests: ${lastError?.message ?? 'Unknown error'}`,
  );
}

async function persistStorageState(apiContext: APIRequestContext) {
  const authDir = path.resolve(process.cwd(), 'playwright', '.auth');
  await fs.mkdir(authDir, { recursive: true });
  const statePath = path.join(authDir, 'admin.json');
  await apiContext.storageState({ path: statePath });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(apiContext: APIRequestContext) {
  const startedAt = Date.now();
  let lastError: Error | null = null;

  while (Date.now() - startedAt < SERVER_READY_TIMEOUT_MS) {
    try {
      // Use an unprotected endpoint as a readiness probe.
      const response = await apiContext.get('/api/v1/example?name=playwright');

      if (response.ok()) {
        return;
      }

      lastError = new Error(`Server not ready (status ${response.status()})`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown server readiness error');
    }

    await delay(500);
  }

  throw new Error(
    `Timed out waiting for server readiness: ${lastError?.message ?? 'Unknown error'}`,
  );
}
