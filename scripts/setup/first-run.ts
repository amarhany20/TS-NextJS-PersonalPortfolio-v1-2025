#!/usr/bin/env node
/**
 * First-run setup script (Agent C)
 * - Prompts for DB: SQLite or Neon Postgres
 * - Updates .env
 * - Switches Prisma provider in prisma/schema.prisma
 * - Runs prisma generate + migrate + seed
 * - Optionally starts dev server
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, '.env');
const PRISMA_SCHEMA = path.join(ROOT, 'prisma', 'schema.prisma');
const PRISMA_MIGRATIONS_DIR = path.join(ROOT, 'prisma', 'migrations');

function log(msg: string) {
  console.log(`[first-run] ${msg}`);
}

function warn(msg: string) {
  console.warn(`[first-run] ${msg}`);
}

function err(msg: string) {
  console.error(`[first-run] ${msg}`);
}

function parseEnv(content: string): Record<string, string> {
  const env: Record<string, string> = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1);
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[key] = val;
  }
  return env;
}

function serializeEnv(env: Record<string, string>, original?: string): string {
  // Preserve comments and unknown lines by reconstructing from original when possible
  const lines = original ? original.split(/\r?\n/) : [];
  const seen = new Set<string>();
  const out: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) {
      out.push(rawLine);
      continue;
    }
    const idx = rawLine.indexOf('=');
    const key = rawLine.slice(0, idx).trim();
    if (env[key] !== undefined) {
      out.push(`${key}=${needsQuotes(env[key]) ? JSON.stringify(env[key]) : env[key]}`);
      seen.add(key);
    } else {
      out.push(rawLine);
    }
  }

  for (const [key, val] of Object.entries(env)) {
    if (!seen.has(key)) {
      out.push(`${key}=${needsQuotes(val) ? JSON.stringify(val) : val}`);
    }
  }

  return out.join('\n') + '\n';
}

function needsQuotes(val: string) {
  return /\s|#|;|"|'/g.test(val);
}

async function ensureEnvUpdates(updates: Record<string, string>) {
  let original = '';
  let current: Record<string, string> = {};
  if (fs.existsSync(ENV_PATH)) {
    original = await fsp.readFile(ENV_PATH, 'utf8');
    current = parseEnv(original);
  }
  const merged = { ...current, ...updates };
  const next = serializeEnv(merged, original);
  await fsp.writeFile(ENV_PATH, next, 'utf8');
}

async function readPrismaSchema(): Promise<string> {
  return await fsp.readFile(PRISMA_SCHEMA, 'utf8');
}

async function writePrismaSchema(content: string) {
  await fsp.writeFile(PRISMA_SCHEMA, content, 'utf8');
}

function setProvider(schema: string, provider: 'sqlite' | 'postgresql') {
  return schema.replace(/provider\s*=\s*"(sqlite|postgresql)"/, `provider = "${provider}"`);
}

function detectMigrationsExist(): boolean {
  if (!fs.existsSync(PRISMA_MIGRATIONS_DIR)) return false;
  const entries = fs.readdirSync(PRISMA_MIGRATIONS_DIR, { withFileTypes: true });
  return entries.some((e) => e.isDirectory());
}

async function runCmd(cmd: string, args: string[], cwd = ROOT): Promise<number> {
  return await new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', cwd, shell: process.platform === 'win32' });
    child.on('error', reject);
    child.on('close', (code) => resolve(code ?? 1));
  });
}

async function main() {
  const rl = readline.createInterface({ input, output });
  log('Welcome! Let’s set up your local database.');

  const dbChoiceRaw = await rl.question('Choose database [sqlite/neon]: ');
  const dbChoice = dbChoiceRaw.trim().toLowerCase();
  if (!['sqlite', 'neon'].includes(dbChoice)) {
    rl.close();
    err('Invalid choice. Please run again and choose sqlite or neon.');
    process.exit(1);
  }

  let databaseUrl = '';
  let targetProvider: 'sqlite' | 'postgresql' = 'sqlite';

  if (dbChoice === 'sqlite') {
    databaseUrl = 'file:./dev.db';
    targetProvider = 'sqlite';
    log('Using SQLite with DATABASE_URL=file:./dev.db');
  } else {
    targetProvider = 'postgresql';
    const neon = await rl.question('Enter Neon Postgres DATABASE_URL (include sslmode=require): ');
    databaseUrl = neon.trim();
    if (!databaseUrl.startsWith('postgres')) {
      rl.close();
      err('DATABASE_URL must start with postgresql://');
      process.exit(1);
    }
  }

  // Seed admin values
  const adminEmail = (await rl.question('Admin email [admin@example.com]: ')).trim() || 'admin@example.com';
  const adminUser = (await rl.question('Admin username [admin]: ')).trim() || 'admin';
  const adminName = (await rl.question('Admin display name [Portfolio Admin]: ')).trim() || 'Portfolio Admin';
  const adminPass = (await rl.question('Admin password [change-me-now]: ')).trim() || 'change-me-now';

  const startDevRaw = await rl.question('Run migrate + seed now and start dev server? [Y/n]: ');
  const startDev = (startDevRaw.trim().toLowerCase() || 'y').startsWith('y');

  rl.close();

  // Update .env
  log('Updating .env ...');
  await ensureEnvUpdates({
    DATABASE_URL: databaseUrl,
    SEED_ADMIN_EMAIL: adminEmail,
    SEED_ADMIN_USERNAME: adminUser,
    SEED_ADMIN_DISPLAY_NAME: adminName,
    SEED_ADMIN_PASSWORD: adminPass,
    NODE_ENV: 'development',
  });

  // Update Prisma provider
  log(`Switching Prisma provider to ${targetProvider} ...`);
  const schema = await readPrismaSchema();
  const updatedSchema = setProvider(schema, targetProvider);
  if (schema !== updatedSchema) {
    await writePrismaSchema(updatedSchema);
  }

  // Prisma generate
  log('Running prisma generate ...');
  let code = await runCmd('pnpm', ['exec', 'prisma', 'generate']);
  if (code !== 0) process.exit(code);

  // Prisma migrate
  const hasMigrations = detectMigrationsExist();
  const migrateArgs = hasMigrations
    ? ['exec', 'prisma', 'migrate', 'dev']
    : ['exec', 'prisma', 'migrate', 'dev', '--name', 'init'];

  log('Running prisma migrate dev ...');
  code = await runCmd('pnpm', migrateArgs);
  if (code !== 0) process.exit(code);

  // Seed
  log('Seeding database ...');
  code = await runCmd('pnpm', ['run', 'db:seed']);
  if (code !== 0) process.exit(code);

  if (startDev) {
    log('Starting dev server (Ctrl+C to stop) ...');
    await runCmd('pnpm', ['run', 'dev']);
  } else {
    log('Setup complete. You can start the app with: pnpm dev');
  }
}

main().catch((e) => {
  err(`Failed: ${e?.message || e}`);
  process.exit(1);
});
