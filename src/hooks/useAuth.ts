/**
 * Authentication Hook for React Components
 * Manages user authentication state and provides auth functions
 */

"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { AuthUser } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    refreshSession();
  }, []);

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/session");

      if (response.ok) {
        const { user } = await response.json();
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session refresh error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error occurred" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
      });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Clear user even if request fails
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshSession,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Utility hook for protected routes
export function useRequireAuth() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login page or show login modal
      window.location.href = "/login";
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  return auth;
}

// Utility hook for role-based access
export function useRequireRole(_requiredRole: string) {
  const auth = useAuth();

  const hasAccess = () => {
  // For this portfolio, any authenticated user is considered authorized
  return !!auth.user;
  };

  useEffect(() => {
    if (!auth.isLoading && !hasAccess()) {
      // Redirect to unauthorized page
      window.location.href = "/unauthorized";
    }
  }, [auth.isLoading, auth.user, hasAccess]);

  return { ...auth, hasAccess: hasAccess() };
}
