/**
 * Login Form Component
 * Dark mode authentication form for portfolio admin access
 */

"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(formData);
      if (result.success) {
        // Redirect to admin dashboard
        router.push("/admin");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-[var(--accent-primary)] flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">Sign in to Admin Panel</h2>
          <p className="text-[var(--text-secondary)]">Access your portfolio admin interface</p>
        </div>

        {/* Form */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[var(--text-secondary)]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[var(--text-secondary)]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <div className="text-sm text-red-400">{error}</div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--text-secondary)]">Secure admin access for portfolio management</p>
          </div>
        </div>
      </div>
    </div>
  );
}
