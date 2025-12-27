'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Database, CheckCircle } from 'lucide-react';

interface DatabaseStepProps {
  data?: {
    type: 'sqlite' | 'postgresql';
    connectionString?: string;
  };
  onUpdate: (data: { type: 'sqlite' | 'postgresql'; connectionString?: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function DatabaseStep({ data, onUpdate, onNext, onPrev }: DatabaseStepProps) {
  const [selectedType, setSelectedType] = useState<'sqlite' | 'postgresql'>(data?.type || 'sqlite');
  const [connectionString, setConnectionString] = useState(data?.connectionString || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTypeChange = (type: 'sqlite' | 'postgresql') => {
    setSelectedType(type);
    setTestResult(null);
    if (type === 'sqlite') {
      setConnectionString('file:./dev.db');
    } else {
      setConnectionString('');
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/setup/test-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedType, connectionString }),
      });

      if (response.ok) {
        setTestResult('success');
      } else {
        setTestResult('error');
      }
    } catch (error) {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleNext = () => {
    onUpdate({ type: selectedType, connectionString });
    onNext();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Database Configuration</h2>
          <p className="text-muted mt-2">
            Choose your database type. SQLite is recommended for development and small sites.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedType === 'sqlite'
                  ? 'border-accent-primary bg-accent-primary/5'
                  : 'border-border hover:border-accent-primary/50'
              }`}
              onClick={() => handleTypeChange('sqlite')}
            >
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-accent-primary" />
                <div>
                  <h3 className="font-medium text-foreground">SQLite</h3>
                  <p className="text-sm text-muted">File-based database, no setup required</p>
                </div>
                {selectedType === 'sqlite' && (
                  <CheckCircle className="w-5 h-5 text-accent-primary ml-auto" />
                )}
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedType === 'postgresql'
                  ? 'border-accent-primary bg-accent-primary/5'
                  : 'border-border hover:border-accent-primary/50'
              }`}
              onClick={() => handleTypeChange('postgresql')}
            >
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-accent-primary" />
                <div>
                  <h3 className="font-medium text-foreground">PostgreSQL</h3>
                  <p className="text-sm text-muted">External database, requires connection string</p>
                </div>
                {selectedType === 'postgresql' && (
                  <CheckCircle className="w-5 h-5 text-accent-primary ml-auto" />
                )}
              </div>
            </div>
          </div>

          {selectedType === 'postgresql' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Connection String
              </label>
              <input
                type="text"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                placeholder="postgresql://user:password@host:port/database?sslmode=require"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
              <p className="text-xs text-muted">
                Include ?sslmode=require for most cloud providers
              </p>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button
              onClick={testConnection}
              disabled={isTesting || (selectedType === 'postgresql' && !connectionString)}
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
            disabled={selectedType === 'postgresql' && !connectionString}
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