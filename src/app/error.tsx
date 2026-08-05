'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { logger } from '@/utils/logger';

/**
 * Per-route error boundary UI for App Router rendering failures.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Root App Error Boundary caught unexpected failure', error);
  }, [error]);

  return (
    // NOTE: this is the per-route error boundary and renders INSIDE the root
    // layout's <html>/<body>, so it must not include its own document tags.
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
  );
}
