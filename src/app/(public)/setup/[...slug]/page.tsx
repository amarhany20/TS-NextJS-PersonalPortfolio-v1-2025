import { redirect } from 'next/navigation';

/**
 * Preserves backwards compatibility for legacy setup links while redirecting every
 * retired setup step to the supported public landing path.
 */
export default function LegacySetupRedirectPage() {
  redirect('/home');
}
