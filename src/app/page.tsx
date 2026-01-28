/**
 * Root Page
 *
 * Redirects to the public home page.
 */

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/home');
}


