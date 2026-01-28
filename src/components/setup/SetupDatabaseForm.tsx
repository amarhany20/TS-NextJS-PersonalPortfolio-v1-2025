'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { mergeSetupDraft } from './SetupStorage';

interface DatabaseConfig {
  type: 'postgresql';
  connectionString?: string;
}

export function SetupDatabaseForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [config, setConfig] = useState<DatabaseConfig>({
    type: 'postgresql',
    connectionString: '',
  });
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleInputChange = (value: string) => {
    setConfig(prev => ({ ...prev, connectionString: value }));
    setTestResult(null);
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/setup/test-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'postgresql',
          connectionString: config.connectionString || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setTestResult({ success: true, message: 'Connection successful!' });
      } else {
        setTestResult({ success: false, message: result.error || 'Connection failed' });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleContinue = async () => {
    if (!testResult?.success) {
      await testConnection();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/setup/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'postgresql',
          connectionString: config.connectionString || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to configure database');
      }

      mergeSetupDraft({
        database: {
          type: 'postgresql',
          connectionString: config.connectionString || undefined,
        },
      });

      router.push('/setup/admin');
    } catch (error) {
      console.error('Database setup error:', error);
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Database setup failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Neon PostgreSQL (DATABASE_URL)
          </label>
          <input
            type="text"
            value={config.connectionString}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="postgresql://user:pass@host/db?sslmode=require"
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Vercel is stateless. Set DATABASE_URL in Vercel Environment Variables to persist the
            connection. This field is only used to test the connection before continuing.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={testConnection}
            disabled={isTesting}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>

          {testResult && (
            <div
              className={`text-sm ${
                testResult.success
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {testResult.message}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={() => router.push('/setup/welcome')}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            ← Back
          </button>

          <button
            onClick={handleContinue}
            disabled={isLoading || !testResult?.success}
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Continuing...' : 'Continue'}
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
