import { revalidatePath } from 'next/cache';

/**
 * Revalidates every public page that can be affected by a content mutation.
 * Call after any successful create/update/delete/reorder in the admin API so
 * statically prerendered public pages (home, portfolio, blogs, services, and
 * portfolio/blog detail routes) do not go stale between deployments.
 */
export function revalidatePublicPages(options?: { portfolioSlug?: string; blogSlug?: string }) {
  revalidatePath('/', 'layout');
  revalidatePath('/home');
  revalidatePath('/portfolio');
  revalidatePath('/blogs');
  revalidatePath('/services');

  if (options?.portfolioSlug) {
    revalidatePath(`/portfolio/${options.portfolioSlug}`);
  }

  if (options?.blogSlug) {
    revalidatePath(`/blogs/${options.blogSlug}`);
  }
}
