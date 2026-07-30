import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function spawnCommand(command: string, args: string[], options: Parameters<typeof spawn>[2]) {
  if (process.platform === 'win32') {
    return spawn(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', command, ...args], options);
  }

  return spawn(command, args, options);
}

async function run() {
  const cwd = process.cwd();
  const databaseUrl = process.env.DATABASE_URL;
  const isIsolatedPlaywright = process.env.PLAYWRIGHT_ISOLATED === '1';

  if (!databaseUrl) {
    throw new Error(
      'The isolated Playwright server requires DATABASE_URL to be set to a PostgreSQL-compatible database.',
    );
  }

  // Preserve the tmp workspace used by Playwright artifacts and any local test helpers.
  await fs.mkdir(path.resolve(cwd, 'tmp'), { recursive: true });

  if (isIsolatedPlaywright) {
    await fs.rm(path.resolve(cwd, '.next'), { recursive: true, force: true });
    await exec(
      npxCommand,
      ['prisma', 'db', 'push', '--skip-generate', '--force-reset', '--accept-data-loss'],
      cwd,
    );
  } else {
    await exec(npxCommand, ['prisma', 'db', 'push', '--skip-generate'], cwd);
  }
  await exec(npmCommand, ['run', 'db:seed'], cwd);
  await exec(npmCommand, ['run', 'build'], cwd, undefined, {
    PLAYWRIGHT_ISOLATED: '0',
  });

  const next = spawnCommand(npmCommand, ['run', 'start', '--', '-p', process.env.PORT ?? '3000'], {
    cwd,
    env: {
      ...process.env,
      PLAYWRIGHT_ISOLATED: '0',
    },
    stdio: 'inherit',
  });

  const shutdown = (signal: NodeJS.Signals) => {
    next.kill(signal);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  next.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  console.info(`[e2e] Webserver starting with DATABASE_URL=${databaseUrl ?? '(default/.env)'}`);
}
function exec(
  command: string,
  args: string[],
  cwd: string,
  stdinText?: string,
  envOverrides?: Record<string, string>,
) {
  return new Promise<void>((resolve, reject) => {
    const child = spawnCommand(command, args, {
      cwd,
      env: {
        ...process.env,
        ...envOverrides,
      },
      stdio: stdinText !== undefined ? ['pipe', 'inherit', 'inherit'] : 'inherit',
    });

    if (stdinText !== undefined) {
      child.stdin?.end(stdinText);
    }

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) return resolve();
      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

run().catch((error) => {
  console.error('[e2e] Failed to start webserver:', error);
  process.exit(1);
});
