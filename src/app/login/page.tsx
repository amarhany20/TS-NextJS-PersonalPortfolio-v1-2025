'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useToast } from '@/components/ui/ToastProvider';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const message = payload?.error?.message ?? 'Login failed. Please check your credentials.';
          setError(message);
          showToast({ variant: 'error', title: 'Login failed', description: message });
          return;
        }

        showToast({
          variant: 'success',
          title: 'Login successful',
          description: 'Redirecting to admin dashboard...',
        });
        router.push('/admin');
        router.refresh();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
        showToast({ variant: 'error', title: 'Login failed', description: message });
      }
    });
  };

  return (
    <section className="mx-auto max-w-lg space-y-6 py-16">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-semibold">Admin Login</h1>
        <p className="text-muted-foreground">Sign in to access the admin dashboard</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6"
      >
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent-primary)]"
            placeholder="Enter your username"
            required
            autoComplete="username"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent-primary)]"
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        <p className="mt-2">
          <Link href="/home" className="text-[var(--accent-primary)] hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </section>
  );
}
