export default function AdminRecommendationsPage() {
  return (
    <section className="space-y-3">
      <header>
        <h1 className="text-2xl font-semibold">Testimonials</h1>
        <p className="text-sm text-[var(--text-secondary)]">Collect and curate recommendations displayed on the home page.</p>
      </header>
      <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--card-bg)]/40 p-6 text-sm text-[var(--text-secondary)]">
        Upcoming tables and editors will let you approve, edit, or archive feedback.
      </div>
    </section>
  );
}
