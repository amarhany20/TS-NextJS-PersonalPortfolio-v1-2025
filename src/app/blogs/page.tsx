export default function BlogsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">Thoughts, tutorials, and insights from my development journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg hover:shadow-[var(--accent-primary)]/10 transition-all">
          <h2 className="text-xl font-semibold text-foreground mb-3">Getting Started with Next.js 15</h2>
          <p className="text-[var(--text-secondary)] mb-4">Exploring the new features and improvements in Next.js 15, including the App Router and server components.</p>
          <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
            <span>Dec 15, 2024</span>
            <span>5 min read</span>
          </div>
        </article>

        <article className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg hover:shadow-[var(--accent-primary)]/10 transition-all">
          <h2 className="text-xl font-semibold text-foreground mb-3">Building Scalable APIs with Node.js</h2>
          <p className="text-[var(--text-secondary)] mb-4">Best practices for designing and implementing scalable REST APIs using Node.js and Express.</p>
          <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
            <span>Dec 10, 2024</span>
            <span>8 min read</span>
          </div>
        </article>

        <article className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg hover:shadow-[var(--accent-primary)]/10 transition-all">
          <h2 className="text-xl font-semibold text-foreground mb-3">TypeScript Tips and Tricks</h2>
          <p className="text-[var(--text-secondary)] mb-4">Advanced TypeScript techniques to improve your code quality and developer experience.</p>
          <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
            <span>Dec 5, 2024</span>
            <span>6 min read</span>
          </div>
        </article>

        <article className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6 hover:shadow-lg hover:shadow-[var(--accent-primary)]/10 transition-all">
          <h2 className="text-xl font-semibold text-foreground mb-3">Responsive Design with Tailwind CSS</h2>
          <p className="text-[var(--text-secondary)] mb-4">Creating beautiful, responsive layouts using Tailwind CSS utility classes and best practices.</p>
          <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
            <span>Nov 28, 2024</span>
            <span>7 min read</span>
          </div>
        </article>
      </div>
    </div>
  );
}
