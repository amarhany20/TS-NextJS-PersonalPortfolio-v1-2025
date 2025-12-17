import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

async function run() {
  const cwd = process.cwd();
  const databaseUrl = process.env.DATABASE_URL;

  // Ensure temp folder exists for the default sqlite DB location.
  await fs.mkdir(path.resolve(cwd, 'tmp'), { recursive: true });

  await exec('npm', ['run', 'db:push'], cwd);
  await exec('npm', ['run', 'db:seed'], cwd);

  const next = spawn('npm', ['run', 'dev'], {
    cwd,
    env: process.env,
    stdio: 'inherit',
    shell: true,
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

function exec(command: string, args: string[], cwd: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: 'inherit',
      shell: true,
    });

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
