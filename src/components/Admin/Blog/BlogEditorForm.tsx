"use client";

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import type { Blog, BlogCategorySummary, BlogTagSummary, BlogStatus } from '@/types/blog';
import { calculateReadingTime, slugify } from '@/utils/helpers';
import { RichTextEditor } from './RichTextEditor';

interface BlogEditorFormProps {
  mode: 'create' | 'edit';
  initialPost?: Blog;
  categories: BlogCategorySummary[];
  tags: BlogTagSummary[];
}

interface TaxonomyItem {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export function BlogEditorForm({ mode, initialPost, categories, tags }: BlogEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialPost?.title ?? '');
  const [slug, setSlug] = useState(initialPost?.slug ?? '');
  const [summary, setSummary] = useState(initialPost?.summary ?? '');
  const [status, setStatus] = useState<BlogStatus>(initialPost?.status ?? 'draft');
  const [content, setContent] = useState(initialPost?.content ?? '');
  const [scheduledAt, setScheduledAt] = useState(() => (initialPost?.publishedAt ? toLocalDatetime(initialPost.publishedAt) : ''));
  const [selectedCategories, setSelectedCategories] = useState<TaxonomyItem[]>(initialPost?.categories ?? []);
  const [selectedTags, setSelectedTags] = useState<TaxonomyItem[]>(initialPost?.tags ?? []);
  const [pendingMessage, setPendingMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, startTransition] = useTransition();

  const readingTime = useMemo(() => calculateReadingTime(content || initialPost?.content || ''), [content, initialPost?.content]);

  const availableCategories = useMemo(() => mergeTaxonomies(categories, selectedCategories), [categories, selectedCategories]);
  const availableTags = useMemo(() => mergeTaxonomies(tags, selectedTags), [tags, selectedTags]);

  function handleSelectTaxonomy(type: 'category' | 'tag', item: TaxonomyItem) {
    const updater = type === 'category' ? setSelectedCategories : setSelectedTags;
    updater((current) => {
      if (current.some((entry) => entry.slug === item.slug)) {
        return current.filter((entry) => entry.slug !== item.slug);
      }
      return [...current, item];
    });
  }

  function handleAddTaxonomy(type: 'category' | 'tag', value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    const slug = slugify(trimmed);
    if (!slug) {
      return;
    }
    const item: TaxonomyItem = {
      id: trimmed,
      name: trimmed,
      slug,
    };
    handleSelectTaxonomy(type, item);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPendingMessage(null);

    startTransition(async () => {
      try {
        const payload = buildPayload();
        const endpoint = mode === 'create' ? '/api/v1/blogs' : `/api/v1/blogs/${initialPost?.slug}`;
        const method = mode === 'create' ? 'POST' : 'PATCH';

        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.error?.message ?? 'Failed to save blog post');
        }

        setPendingMessage({ type: 'success', text: 'Post saved. Redirecting…' });
        router.replace('/admin/blogs');
        router.refresh();
      } catch (error) {
        console.error(error);
        setPendingMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save blog post' });
      }
    });
  }

  function buildPayload() {
    const normalizedSlug = slugify(slug || title) ?? '';
    const publishDate = status === 'scheduled' ? scheduledAt : status === 'published' ? scheduledAt || new Date().toISOString() : undefined;

    return {
      title: title.trim(),
      slug: normalizedSlug,
      summary: summary.trim() || undefined,
      content,
      status,
      publishedAt: publishDate ? toIsoString(publishDate) : undefined,
      readingTime,
      categories: selectedCategories.map(({ slug: catSlug, name, description }) => ({ slug: catSlug, name, description })),
      tags: selectedTags.map(({ slug: tagSlug, name, description }) => ({ slug: tagSlug, name, description })),
    };
  }

  const disableSubmit = isSubmitting || !title.trim() || !content.trim() || (status === 'scheduled' && !scheduledAt);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {pendingMessage && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            pendingMessage.type === 'success'
              ? 'border-emerald-400 bg-emerald-400/10 text-emerald-100'
              : 'border-red-400 bg-red-400/10 text-red-100'
          }`}
        >
          {pendingMessage.text}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2"
          placeholder="e.g. Building delightful developer experiences"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2"
            placeholder="auto-generated from title if left blank"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as BlogStatus)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {status === 'scheduled' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Publish at</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2"
            required
          />
          <p className="text-xs text-[var(--text-secondary)]">
            Scheduled posts require a publish date. We will store this in UTC automatically.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Summary</label>
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2"
          rows={3}
          placeholder="Optional teaser copy"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <label className="font-medium">Content</label>
          <span className="text-[var(--text-secondary)]">{readingTime} min read</span>
        </div>
        <RichTextEditor value={content} onChange={setContent} placeholder="Write your post..." />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TaxonomySelector
          label="Categories"
          available={availableCategories}
          selected={selectedCategories}
          onToggle={(item) => handleSelectTaxonomy('category', item)}
          onAdd={(value) => handleAddTaxonomy('category', value)}
        />
        <TaxonomySelector
          label="Tags"
          available={availableTags}
          selected={selectedTags}
          onToggle={(item) => handleSelectTaxonomy('tag', item)}
          onAdd={(value) => handleAddTaxonomy('tag', value)}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={disableSubmit}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            disableSubmit
              ? 'bg-[var(--accent-muted)] text-[var(--text-secondary)] cursor-not-allowed'
              : 'bg-[var(--accent-primary)] text-black hover:opacity-90'
          }`}
        >
          {mode === 'create' ? 'Publish post' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

interface SelectorProps {
  label: string;
  available: TaxonomyItem[];
  selected: TaxonomyItem[];
  onToggle: (item: TaxonomyItem) => void;
  onAdd: (value: string) => void;
}

function TaxonomySelector({ label, available, selected, onToggle, onAdd }: SelectorProps) {
  const [input, setInput] = useState('');
  const lowerLabel = label.toLowerCase();
  const singularLabel = lowerLabel.endsWith('ies')
    ? `${label.slice(0, -3)}y`
    : lowerLabel.endsWith('s')
      ? label.slice(0, -1)
      : label;

  return (
    <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{label}</p>
        <span className="text-xs text-[var(--text-secondary)]">{selected.length} selected</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {available.map((item) => {
          const isActive = selected.some((entry) => entry.slug === item.slug);
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => onToggle(item)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                isActive ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)]' : 'border-[var(--border)] text-[var(--text-secondary)]'
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          placeholder={`Add new ${singularLabel.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={() => {
            onAdd(input);
            setInput('');
          }}
          className="rounded-lg bg-[var(--accent-muted)] px-3 py-2 text-sm font-medium"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function mergeTaxonomies(list: TaxonomyItem[], selected: TaxonomyItem[]): TaxonomyItem[] {
  const map = new Map<string, TaxonomyItem>();
  [...list, ...selected].forEach((item) => {
    map.set(item.slug, item);
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function toLocalDatetime(value: string) {
  const date = new Date(value);
  const pad = (num: number) => String(num).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function toIsoString(value: string) {
  const date = new Date(value);
  return date.toISOString();
}
