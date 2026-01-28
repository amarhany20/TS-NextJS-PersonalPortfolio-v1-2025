'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface DatabaseStepProps {
  data?: {
    type: 'postgresql';
    connectionString?: string;
  };
  onUpdate: (data: { type: 'postgresql'; connectionString?: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function DatabaseStep({ data, onUpdate, onNext, onPrev }: DatabaseStepProps) {
  const [connectionString, setConnectionString] = useState(data?.connectionString || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/setup/test-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'postgresql', connectionString }),
      });

      setTestResult(response.ok ? 'success' : 'error');
    } catch (error) {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleNext = () => {
    onUpdate({ type: 'postgresql', connectionString });
    onNext();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Database Configuration</h2>
          <p className="text-muted mt-2">
            Provide your Neon PostgreSQL connection string. Vercel must store DATABASE_URL to
            persist the connection.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Connection String</label>
          <input
            type="text"
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)}
            placeholder="postgresql://user:password@host:port/database?sslmode=require"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
          <p className="text-xs text-muted">Include ?sslmode=require for most cloud providers.</p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={testConnection}
            disabled={isTesting}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
          {testResult === 'success' && (
            <span className="text-success text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Connection successful
            </span>
          )}
          {testResult === 'error' && (
            <span className="text-danger text-sm">Connection failed</span>
          )}
        </div>

        <div className="flex justify-between pt-6">
          <button
            onClick={onPrev}
            className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!connectionString}
            className="inline-flex items-center px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
