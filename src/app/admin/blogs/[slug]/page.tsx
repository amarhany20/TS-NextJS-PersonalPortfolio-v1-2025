import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BlogEditorForm } from '@/components/Admin/Blog/BlogEditorForm';
import { BlogService } from '@/server/services/BlogService';

interface AdminBlogEditorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AdminBlogEditorPage({ params }: AdminBlogEditorPageProps) {
  const { slug } = await params;
  const [post, categories, tags] = await Promise.all([
    BlogService.getPostBySlug(slug),
    BlogService.listCategories(),
    BlogService.listTags(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <section className="space-y-8 py-6">
      <header className="flex flex-wrap items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            Blog Editor
          </p>
          <h1 className="text-3xl font-semibold">Edit: {post.title}</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Update metadata, categories, tags, and scheduled publish time. Draft changes auto-sync
            on save.
          </p>
        </div>
        <Link
          href="/admin/blogs"
          className="ml-auto rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-[var(--accent-primary)]"
        >
          Back to posts
        </Link>
      </header>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 shadow-lg shadow-black/10">
        <BlogEditorForm mode="edit" initialPost={post} categories={categories} tags={tags} />
      </div>
    </section>
  );
}
