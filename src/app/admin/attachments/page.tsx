import { AttachmentsLibrary } from '@/components/Admin/Attachments/AttachmentsLibrary';
import { AttachmentService } from '@/server/services/AttachmentService';

export default async function AdminAttachmentsPage() {
  const assets = await AttachmentService.getAttachmentLibrary();

  return (
    <section className="space-y-6 py-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Attachments</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Upload photos, PDFs, and other files for reuse across the site. Preview images, copy the
          link or location, and archive files you no longer need.
        </p>
      </header>

      <AttachmentsLibrary initialAssets={assets} />
    </section>
  );
}
