import Link from 'next/link';

import { BlogTable } from '@/components/Admin/Blog/BlogTable';
import { BlogService } from '@/server/services/BlogService';

export default async function AdminBlogsPage() {
  const [posts, categories, tags] = await Promise.all([
    BlogService.listAllPosts(),
    BlogService.listCategories(),
    BlogService.listTags(),
  ]);

  return (
    <section className="space-y-6 py-6">
      <header className="space-y-2">
        <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wide">
          Phase 5 · Blog Module
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Blog Posts</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Draft, schedule, and publish long-form content. Filters and scheduling controls live
              below while the editor preview opens in a side drawer.
            </p>
          </div>
          <Link
            href="/admin/blogs/new"
            className="ml-auto rounded-full bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:opacity-90"
          >
            New Post
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total posts" value={posts.length} />
        <StatCard label="Categories" value={categories.length} />
        <StatCard label="Tags" value={tags.length} />
      </div>

      <BlogTable posts={posts} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{label}</p>
      <p className="text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
