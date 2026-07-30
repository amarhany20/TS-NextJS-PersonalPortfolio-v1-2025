'use client';
import type { Service } from '@/types/service';
import { useState } from 'react';
import {
  Camera,
  Calculator,
  Globe,
  ServerCog,
  ShoppingBag,
  Workflow,
  ChevronDown,
} from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ServerCog,
  ShoppingBag,
  Calculator,
  Camera,
  Globe,
  Workflow,
};

export interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [open, setOpen] = useState(false);
  const Icon = (service.icon && ICONS[service.icon]) || ServerCog;

  return (
    <article className="group relative flex flex-col bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)]">
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground leading-snug mb-1">
            {service.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-3">{service.description}</p>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="ml-2 inline-flex items-center justify-center h-8 w-8 rounded-md border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/40 transition"
          aria-expanded={open}
          aria-label={open ? 'Collapse details' : 'Expand details'}
        >
          <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} mt-4`}
      >
        <div className="overflow-hidden flex flex-col gap-6 pt-1">
          {service.features?.length ? (
            <div>
              <h3 className="text-xs font-semibold tracking-wide uppercase text-[var(--text-secondary)] mb-2">
                Key Features
              </h3>
              <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                {service.features.slice(0, 12).map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[var(--accent-primary)]">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {service.technologies?.length ? (
            <div>
              <h3 className="text-xs font-semibold tracking-wide uppercase text-[var(--text-secondary)] mb-2">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.technologies.slice(0, 14).map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-[var(--accent-muted)] text-[14px] font-medium tracking-wide text-[var(--text-secondary)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* pricing and delivery removed per request */}

          {service.longDescription && (
            <div>
              <h3 className="text-xs font-semibold tracking-wide uppercase text-[var(--text-secondary)] mb-2">
                Overview
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {service.longDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
