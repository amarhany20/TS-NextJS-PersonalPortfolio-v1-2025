'use client';

import React, { useState } from 'react';
import { Download, Upload, AlertTriangle, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';
import { logger } from '@/utils/logger';

export function BackupSettingsForm() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgePassword, setPurgePassword] = useState('');
  const [purgeConfirmText, setPurgeConfirmText] = useState('');
  const [isPurging, setIsPurging] = useState(false);

  const handleDownloadBackup = async () => {
    setIsExporting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/v1/admin/backup');
      if (!res.ok) throw new Error('Failed to export database backup.');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: `Backup file "${filename}" downloaded successfully!`,
      });
    } catch (error) {
      logger.error('Failed to download backup', error);
      setStatusMessage({ type: 'error', text: 'Failed to download database backup snapshot.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatusMessage(null);
    }
  };

  const handleRestoreBackup = async () => {
    if (!file) return;

    setIsImporting(true);
    setStatusMessage(null);
    setShowConfirmModal(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/v1/admin/backup', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to restore backup.');
      }

      setStatusMessage({
        type: 'success',
        text: `Database restored successfully! ${json.data?.totalRestored || 0} records processed. Refreshing app...`,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      logger.error('Failed to restore backup', error);
      setStatusMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to restore database backup.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handlePurgeDatabase = async () => {
    setIsPurging(true);
    setStatusMessage(null);
    setShowPurgeModal(false);

    try {
      const res = await fetch('/api/v1/admin/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: purgePassword }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to purge database.');
      }

      setStatusMessage({
        type: 'success',
        text: `Database purged successfully! ${json.data?.totalPurged || 0} records deleted. Refreshing...`,
      });

      setPurgePassword('');
      setPurgeConfirmText('');

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      logger.error('Failed to purge database', error);
      setStatusMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to purge database.',
      });
    } finally {
      setIsPurging(false);
    }
  };

  const purgeEnabled = purgePassword.length > 0 && purgeConfirmText === 'PURGE';

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Feedback Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Export Section */}
      <div className="p-6 rounded-xl border border-white/10 bg-white/5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Download Database Backup (JSON)
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Export a complete portable JSON snapshot containing your settings, portfolio projects,
              blogs, credentials, experience, and skills.
            </p>
          </div>
          <button
            onClick={handleDownloadBackup}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Backup
              </>
            )}
          </button>
        </div>
      </div>

      {/* Import / Restore Section */}
      <div className="p-6 rounded-xl border border-white/10 bg-white/5 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-400" />
            Restore Database Backup
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Upload a valid JSON backup file (`portfolio-backup.json`) to restore your database. This
            will safely update and populate your site content.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-foreground hover:file:bg-white/20 cursor-pointer"
            />
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!file || isImporting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-white font-medium text-sm hover:bg-amber-500 transition-colors disabled:opacity-50 shrink-0"
            >
              {isImporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Restore Backup
                </>
              )}
            </button>
          </div>
          {file && (
            <p className="text-xs text-[var(--text-secondary)]">
              Selected file: <span className="font-mono text-foreground">{file.name}</span> (
              {(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>
      </div>

      {/* Danger Zone — Purge Database */}
      <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            Purge Database
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Permanently delete all content data (portfolio, blogs, services, experience, education,
            skills, certificates, recommendations, media, and contact submissions). Settings and
            admin accounts are preserved.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Admin Password
            </label>
            <input
              type="password"
              value={purgePassword}
              onChange={(e) => setPurgePassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full max-w-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Type <span className="font-mono text-rose-400">PURGE</span> to confirm
            </label>
            <input
              type="text"
              value={purgeConfirmText}
              onChange={(e) => setPurgeConfirmText(e.target.value)}
              placeholder="PURGE"
              className="w-full max-w-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50"
            />
          </div>

          <button
            onClick={() => setShowPurgeModal(true)}
            disabled={!purgeEnabled || isPurging}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 text-white font-medium text-sm hover:bg-rose-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isPurging ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Purging...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Purge All Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-lg font-semibold text-foreground">Confirm Database Restore</h4>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Are you sure you want to restore from{' '}
              <span className="font-mono text-foreground">{file?.name}</span>? This operation will
              update database records inside an atomic transaction.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 text-foreground text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestoreBackup}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition-colors"
              >
                Proceed with Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purge Confirmation Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-rose-500/30 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-lg font-semibold text-foreground">Confirm Database Purge</h4>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              This will <span className="font-semibold text-rose-400">permanently delete</span> all
              portfolio projects, blog posts, services, experience, education, skills, certificates,
              recommendations, media files, and contact submissions.
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Settings and admin accounts will be preserved. This action{' '}
              <span className="font-semibold text-rose-400">cannot be undone</span>.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowPurgeModal(false);
                  setPurgePassword('');
                  setPurgeConfirmText('');
                }}
                className="px-4 py-2 rounded-lg bg-white/10 text-foreground text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurgeDatabase}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-500 transition-colors"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
