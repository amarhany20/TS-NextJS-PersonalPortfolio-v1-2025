/**
 * Login Page
 * Authentication page for CRM access
 */

import LoginForm from "@/components/Auth/LoginForm";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--text-secondary)]">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </AuthProvider>
  );
}
