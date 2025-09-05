import { getBlogPosts } from "@/lib/database-services";

export default async function BlogsPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">Thoughts, tutorials, and insights from my development journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg hover:shadow-[var(--accent-primary)]/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-[var(--accent-muted)] text-[var(--text-secondary)] text-xs rounded-full">{post.category}</span>
              <span className="text-[var(--text-secondary)] text-sm">{post.readTime} min read</span>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-3 hover:text-[var(--accent-primary)] transition-colors">{post.title}</h2>

            <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">{post.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-secondary)] text-xs">{new Date(post.publishedAt).toLocaleDateString()}</span>
                <span className="text-[var(--text-secondary)] text-xs">•</span>
                <span className="text-[var(--text-secondary)] text-xs">By {post.author}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {((Array.isArray(post.tags) ? post.tags : []) as string[]).slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[var(--accent-muted)] text-[var(--text-secondary)] text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
