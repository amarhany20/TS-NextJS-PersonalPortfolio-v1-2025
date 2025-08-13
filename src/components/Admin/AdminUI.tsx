/**
 * Admin UI Components
 * Reusable components for consistent admin interface
 */

import React from "react";
import { Loader2 } from "lucide-react";

// Page Header Component
interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: string;
}

export function AdminPageHeader({ title, subtitle, actions, icon }: AdminPageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && <span className="text-3xl">{icon}</span>}
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">{title}</h1>
            {subtitle && <p className="text-[var(--text-secondary)] mt-2">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center space-x-3">{actions}</div>}
      </div>
    </div>
  );
}

// Card Component
interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export function AdminCard({ children, className = "", padding = "md" }: AdminCardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return <div className={`bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-sm ${paddingClasses[padding]} ${className}`}>{children}</div>;
}

// Form Field Component
interface AdminFormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  description?: string;
}

export function AdminFormField({ label, children, error, required, description }: AdminFormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--text-primary)]">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {description && <p className="text-xs text-[var(--text-secondary)]">{description}</p>}
      {children}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

// Input Component
interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function AdminInput({ error, className = "", ...props }: AdminInputProps) {
  return (
    <input
      className={`w-full px-4 py-3 bg-[var(--accent-muted)] border ${
        error ? "border-red-500" : "border-[var(--border)]"
      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-colors ${className}`}
      {...props}
    />
  );
}

// Textarea Component
interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function AdminTextarea({ error, className = "", ...props }: AdminTextareaProps) {
  return (
    <textarea
      className={`w-full px-4 py-3 bg-[var(--accent-muted)] border ${
        error ? "border-red-500" : "border-[var(--border)]"
      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-colors resize-vertical ${className}`}
      {...props}
    />
  );
}

// Button Component
interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function AdminButton({ variant = "primary", size = "md", loading, icon, children, disabled, className = "", ...props }: AdminButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-[var(--accent-primary)] text-black hover:bg-[var(--accent-primary)]/90 focus:ring-[var(--accent-primary)]",
    secondary: "bg-[var(--accent-muted)] text-[var(--text-primary)] hover:bg-[var(--accent-muted)]/80 border border-[var(--border)]",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    ghost: "text-[var(--text-primary)] hover:bg-[var(--accent-muted)] focus:ring-[var(--accent-primary)]",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

// Alert Component
interface AdminAlertProps {
  type: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
  onClose?: () => void;
}

export function AdminAlert({ type, children, onClose }: AdminAlertProps) {
  const typeClasses = {
    success: "bg-green-500/10 border-green-500/20 text-green-400",
    error: "bg-red-500/10 border-red-500/20 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  };

  return (
    <div className={`rounded-lg border p-4 ${typeClasses[type]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">{children}</div>
        {onClose && (
          <button onClick={onClose} className="ml-4 text-current opacity-70 hover:opacity-100">
            <span className="sr-only">Close</span>×
          </button>
        )}
      </div>
    </div>
  );
}

// Loading Spinner
export function AdminLoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin text-[var(--accent-primary)] ${sizeClasses[size]}`} />
    </div>
  );
}

// Empty State Component
interface AdminEmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminEmptyState({ icon = "📄", title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-[var(--text-secondary)] text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">{title}</h3>
      {description && <p className="text-[var(--text-secondary)] mb-6">{description}</p>}
      {action}
    </div>
  );
}

// Status Badge Component
interface AdminStatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
}

export function AdminStatusBadge({ status, variant = "default" }: AdminStatusBadgeProps) {
  const variantClasses = {
    default: "bg-[var(--accent-muted)] text-[var(--text-primary)]",
    success: "bg-green-500/20 text-green-400",
    error: "bg-red-500/20 text-red-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    info: "bg-blue-500/20 text-blue-400",
  };

  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>{status}</span>;
}

// Table Components
export function AdminTable({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-[var(--border)] ${className}`}>{children}</table>
    </div>
  );
}

export function AdminTableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-[var(--accent-muted)]/30">{children}</thead>;
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border)]">{children}</tbody>;
}

export function AdminTableRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <tr className={`hover:bg-[var(--accent-muted)]/20 transition-colors ${className}`}>{children}</tr>;
}

export function AdminTableHead({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider ${className}`}>{children}</th>;
}

export function AdminTableCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)] ${className}`}>{children}</td>;
}

// Modal component
export const AdminModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}> = ({ isOpen, onClose, title, children, size = "md", className }) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`bg-[var(--bg-primary)] rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] sticky top-0 bg-[var(--bg-primary)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--accent-muted)] rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">{children}</div>
      </div>
    </div>
  );
};
