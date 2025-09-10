"use client";
/**
 * Admin Login Page
 * Authentication page for portfolio admin access
 */

import LoginForm from "@/components/Auth/LoginForm";
import { Suspense } from "react";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--text-secondary)]">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
