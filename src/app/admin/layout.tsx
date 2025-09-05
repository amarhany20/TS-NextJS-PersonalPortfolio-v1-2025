"use client";

import { AuthProvider } from "@/hooks/useAuth";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <header className="w-full border-b border-[var(--border)] bg-[var(--card-bg)]">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <h1 className="text-sm font-semibold text-[var(--text-primary)]">Admin</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </div>
    </AuthProvider>
  );
}
