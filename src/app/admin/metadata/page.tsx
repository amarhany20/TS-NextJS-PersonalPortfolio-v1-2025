"use client";
import React, { useEffect, useState } from 'react';
import { METADATA_DEFINITIONS } from '@/data';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface MetaRecord { key: string; value: string; type: string; category: string; }

export default function MetadataAdminPage() {
  const [items, setItems] = useState<Record<string, MetaRecord>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/metadata');
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Failed');
        const map: Record<string, MetaRecord> = {};
        for (const m of json.data) map[m.key] = m;
        setItems(map);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Metadata Management</h1>
        <p className="text-sm text-[var(--text-secondary)]">Central registry of dynamic site metadata (database-backed). Missing required keys are highlighted.</p>
      </div>
      {loading && <div className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin"/> Loading metadata...</div>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && !error && (
        <div className="overflow-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-[var(--accent-muted)]/40">
              <tr>
                <th className="text-left p-3">Key</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">Value</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {METADATA_DEFINITIONS.map(def => {
                const rec = items[def.key];
                const missing = !rec;
                return (
                  <tr key={def.key} className={missing && def.required ? 'bg-[var(--danger)]/10' : ''}>
                    <td className="p-3 font-mono text-xs">{def.key}</td>
                    <td className="p-3">{def.category}</td>
                    <td className="p-3">{def.type}</td>
                    <td className="p-3 text-[var(--text-secondary)] max-w-xs align-top">{def.description}</td>
                    <td className="p-3 font-mono text-xs break-all align-top">{rec ? rec.value : <span className="text-[var(--text-secondary)] italic">(not set)</span>}</td>
                    <td className="p-3 align-top">{missing ? <XCircle className="h-4 w-4 text-[var(--danger)]"/> : <CheckCircle className="h-4 w-4 text-[var(--success)]"/>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
