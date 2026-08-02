'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Eye, Image as ImageIcon, Trash2, Upload } from 'lucide-react';

import type { AttachmentAsset } from '@/types/attachment';

interface AttachmentsLibraryProps {
  initialAssets: AttachmentAsset[];
}

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

const formatDateTime = (value: string) => dateTimeFormatter.format(new Date(value));

/**
 * Provides a lightweight attachment library for upload, preview, copy-link/copy-path,
 * and deletion workflows used by the admin CMS.
 */
export function AttachmentsLibrary({ initialAssets }: AttachmentsLibraryProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [assets, setAssets] = useState<AttachmentAsset[]>(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<AttachmentAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const hasAssets = assets.length > 0;

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!copiedId) {
      return;
    }
    const timer = setTimeout(() => setCopiedId(null), 2000);
    return () => clearTimeout(timer);
  }, [copiedId]);

  const totalSize = useMemo(() => assets.reduce((acc, asset) => acc + asset.size, 0), [assets]);

  const handleFilePick = () => {
    if (!hydrated || uploading) {
      return;
    }

    inputRef.current?.click();
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    setMessage(null);
    setError(null);

    const uploaded: AttachmentAsset[] = [];

    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append('file', file);

        const response = await fetch('/api/v1/attachments', {
          method: 'POST',
          body,
        });

        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const description = payload?.error?.message ?? 'Unable to upload file.';
          throw new Error(description);
        }

        uploaded.push(payload.data);
      }

      if (uploaded.length) {
        setAssets((current) => [...uploaded, ...current]);
        setMessage(`Uploaded ${uploaded.length} file${uploaded.length > 1 ? 's' : ''}.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (asset: AttachmentAsset) => {
    setMessage(null);
    setError(null);

    const confirmed = window.confirm(`Delete ${asset.originalName ?? asset.filename}?`);
    if (!confirmed) {
      return;
    }

    const previousAssets = assets;
    setAssets((current) => current.filter((item) => item.id !== asset.id));
    if (preview?.id === asset.id) {
      setPreview(null);
    }

    const response = await fetch(`/api/v1/attachments/${asset.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setAssets(previousAssets);
      setError(payload?.error?.message ?? 'Unable to delete asset.');
      return;
    }

    setMessage('Attachment deleted.');
  };

  const handleCopy = async (asset: AttachmentAsset, kind: 'link' | 'path') => {
    const text =
      kind === 'path'
        ? asset.path
        : asset.url.startsWith('http')
          ? asset.url
          : `${window.location.origin}${asset.url}`;

    const ok = await copyText(text);
    if (ok) {
      setMessage(kind === 'path' ? 'Location copied to clipboard.' : 'Link copied to clipboard.');
      setError(null);
      setCopiedId(asset.id);
    } else {
      setError('Unable to copy. Your browser may not allow clipboard access.');
    }
  };

  return (
    <div className="space-y-5">
      <input
        ref={inputRef}
        type="file"
        multiple
        disabled={!hydrated || uploading}
        className="hidden"
        onChange={(event) => handleUpload(event.target.files)}
      />

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/40 p-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Storage usage</p>
          <p className="text-xs text-muted-foreground">
            {assets.length} file{assets.length === 1 ? '' : 's'} • {formatFileSize(totalSize)} used
          </p>
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <button
            type="button"
            onClick={handleFilePick}
            disabled={!hydrated || uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={16} />
            {!hydrated ? 'Loading…' : uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>

      {message ? (
        <p className="text-sm text-emerald-600" aria-live="polite">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-amber-600" role="alert">
          {error}
        </p>
      ) : null}

      {hasAssets ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <article
              key={asset.id}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/60 p-4"
            >
              <button
                type="button"
                onClick={() => asset.mimeType.startsWith('image/') && setPreview(asset)}
                className="relative aspect-video w-full overflow-hidden rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)]"
                aria-label={
                  asset.mimeType.startsWith('image/')
                    ? 'Preview image'
                    : 'Attachment thumbnail placeholder'
                }
              >
                {asset.mimeType.startsWith('image/') ? (
                  <Image
                    src={asset.url}
                    alt={asset.originalName ?? asset.filename}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--text-secondary)]">
                    <ImageIcon size={32} />
                  </div>
                )}
                {asset.width && asset.height ? (
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-white">
                    {asset.width}×{asset.height}
                  </span>
                ) : null}
              </button>

              <div className="space-y-1 text-sm">
                <p className="font-semibold truncate" title={asset.originalName ?? asset.filename}>
                  {asset.originalName ?? asset.filename}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(asset.size)} • {asset.mimeType}
                </p>
                <p className="text-xs text-muted-foreground">
                  Uploaded {formatDateTime(asset.createdAt)}
                  {asset.createdByName ? ` · ${asset.createdByName}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(asset, 'link')}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-muted-foreground transition hover:border-accent"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check size={14} className="text-emerald-500" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy link
                    </>
                  )}
                </button>
                {asset.path && asset.path !== asset.url ? (
                  <button
                    type="button"
                    onClick={() => handleCopy(asset, 'path')}
                    className="rounded-lg border border-[var(--border)] px-2.5 py-2 text-xs font-medium text-muted-foreground transition hover:border-accent"
                    title="Copy relative location"
                  >
                    {copiedId === asset.id ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                ) : null}
                {asset.mimeType.startsWith('image/') ? (
                  <button
                    type="button"
                    onClick={() => setPreview(asset)}
                    className="rounded-lg border border-[var(--border)] p-2 text-muted-foreground transition hover:border-accent"
                    aria-label="Preview image"
                  >
                    <Eye size={16} />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => handleDelete(asset)}
                  className="rounded-lg border border-[var(--border)] p-2 text-muted-foreground transition hover:border-accent"
                  aria-label="Delete asset"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card-bg)]/40 p-8 text-center text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">No attachments yet</p>
          <p className="text-sm text-muted-foreground">
            Upload photos, PDFs, and other files to populate your library.
          </p>
        </div>
      )}

      {preview ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Attachment preview"
          onClick={() => setPreview(null)}
        >
          <div
            className="max-h-full max-w-4xl overflow-hidden rounded-2xl bg-[var(--background)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
              <p className="text-sm font-semibold">{preview.originalName ?? preview.filename}</p>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-muted-foreground"
              >
                Close
              </button>
            </div>
            <div className="bg-black">
              <Image
                src={preview.url}
                alt={preview.originalName ?? preview.filename}
                width={preview.width ?? 1600}
                height={preview.height ?? 1200}
                unoptimized
                className="h-full max-h-[80vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Converts a raw byte count into a compact human-readable label for the asset UI.
 */
function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

/**
 * Copies text to the clipboard, falling back to a temporary textarea + execCommand
 * for browsers that block the async Clipboard API on non-secure origins.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for insecure contexts / older browsers.
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}
