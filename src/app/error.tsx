'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  const isSetupRequired =
    error?.message?.includes('SETUP_REQUIRED') ||
    error?.message?.includes('Site settings have not been initialised') ||
    error?.message?.includes('Database is not initialised');

  if (isSetupRequired) {
    return (
      <html lang="en">
        <body className="bg-background text-foreground">
          <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-2xl bg-card border border-border rounded-xl p-6 space-y-4">
              <h1 className="text-xl font-semibold">Setup required</h1>
              <p className="text-muted">
                The app database is not initialised yet (or the Settings row is missing). Use the setup guide and then
                refresh.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="px-4 py-2 rounded-lg bg-accent text-black"
                >
                  Retry
                </button>
                <Link href="/setup" className="underline text-primary">
                  Open setup instructions
                </Link>
              </div>

              <p className="text-xs text-muted">Error: {error.message}</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl p-6 space-y-4">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="text-muted">Try again, or check the server logs for details.</p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 rounded-lg bg-accent text-black"
              >
                Retry
              </button>
              <Link href="/" className="underline text-primary">
                Go home
              </Link>
            </div>

            <p className="text-xs text-muted">Error: {error.message}</p>
          </div>
        </div>
      </body>
    </html>
  );
}
