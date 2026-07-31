import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export type CalloutType = 'note' | 'tip' | 'important' | 'warning';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const TYPE_CONFIG = {
  note: {
    icon: Info,
    border: 'border-blue-500/40 bg-blue-500/10 text-blue-200',
    iconColor: 'text-blue-400',
    defaultTitle: 'Note',
  },
  tip: {
    icon: CheckCircle2,
    border: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
    iconColor: 'text-emerald-400',
    defaultTitle: 'Tip',
  },
  important: {
    icon: AlertTriangle,
    border: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
    iconColor: 'text-amber-400',
    defaultTitle: 'Important',
  },
  warning: {
    icon: AlertCircle,
    border: 'border-red-500/40 bg-red-500/10 text-red-200',
    iconColor: 'text-red-400',
    defaultTitle: 'Warning',
  },
};

/**
 * Callout Component for MDX Content
 *
 * Renders GitHub-style alert callouts (NOTE, TIP, IMPORTANT, WARNING)
 * with matching icon indicators and themed backgrounds.
 */
export function Callout({ type = 'note', title, children }: CalloutProps): React.JSX.Element {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.note;
  const IconComponent = config.icon;

  return (
    <aside className={`my-6 p-4 rounded-lg border-l-4 ${config.border} shadow-sm transition-all`}>
      <div className="flex items-center gap-2 font-semibold mb-1 text-sm tracking-wide">
        <IconComponent className={`w-4 h-4 ${config.iconColor}`} />
        <span>{title || config.defaultTitle}</span>
      </div>
      <div className="text-sm opacity-90 leading-relaxed pl-6">{children}</div>
    </aside>
  );
}
