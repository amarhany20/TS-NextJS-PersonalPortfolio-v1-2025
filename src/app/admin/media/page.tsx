import { MediaLibrary } from '@/components/Admin/Media/MediaLibrary';
import { MediaService } from '@/server/services/MediaService';

export default async function AdminMediaPage() {
  const assets = await MediaService.getMediaLibrary();

  return (
    <section className="space-y-6 py-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Media library</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Upload brand assets, screenshots, and PDFs for reuse across the site. Preview images, copy
          URLs, and archive files you no longer need.
        </p>
      </header>

      <MediaLibrary initialAssets={assets} />
    </section>
  );
}
