import { ContactInbox } from '@/components/Admin/Contact/ContactInbox';
import { ContactSubmissionService } from '@/server/services/ContactSubmissionService';

export default async function AdminContactPage() {
  const submissions = await ContactSubmissionService.listSubmissions();

  return (
    <section className="space-y-6 py-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Contact inbox</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Review inbound leads, track follow-ups, and archive spam. Status updates sync instantly
          across the dashboard.
        </p>
      </header>

      <ContactInbox initialSubmissions={submissions} />
    </section>
  );
}
