/**
 * Returns a human-readable error message for a failed admin API response, and
 * redirects to the login page when the session has expired (401).
 */
export async function adminError(response: Response): Promise<string> {
  if (response.status === 401) {
    const next = window.location.pathname + window.location.search;
    window.location.assign(`/login?next=${encodeURIComponent(next)}`);
    return 'Your session has expired. Redirecting to login...';
  }

  const payload = (await response.json().catch(() => null)) as {
    error?: { message?: string };
  } | null;
  return payload?.error?.message ?? 'Request failed. Please try again.';
}
