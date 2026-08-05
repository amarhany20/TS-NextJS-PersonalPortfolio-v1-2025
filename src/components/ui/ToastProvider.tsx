'use client';

import { X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastInstance extends Required<ToastOptions> {
  id: string;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-800 dark:text-emerald-50',
  error: 'border-rose-500/40 bg-rose-500/15 text-rose-800 dark:text-rose-50',
  info: 'border-slate-500/40 bg-slate-900/80 text-slate-50',
};

const DEFAULT_DURATION = 4500;

const generateId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastInstance[]>([]);
  const timers = useRef<Record<string, number>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timerId = timers.current[id];
    if (timerId) {
      window.clearTimeout(timerId);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (options: ToastOptions) => {
      if (!options.title) return;
      const id = generateId();
      const duration = options.duration ?? DEFAULT_DURATION;
      const toast: ToastInstance = {
        id,
        title: options.title,
        description: options.description ?? '',
        variant: options.variant ?? 'info',
        duration,
      };

      setToasts((current) => [...current, toast]);
      timers.current[id] = window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(360px,calc(100vw-32px))] flex-col gap-3"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl ring-1 ring-black/10 backdrop-blur ${VARIANT_STYLES[toast.variant]}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold leading-tight">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-xs text-white/80">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                className="rounded-full p-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                onClick={() => dismiss(toast.id)}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
