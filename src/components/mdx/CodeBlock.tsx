'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { logger } from '@/utils/logger';

export interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  language?: string;
  filename?: string;
}

/**
 * CodeBlock Component for MDX Content
 *
 * Renders formatted code snippets with syntax language badges,
 * optional file header labels, and a one-click copy to clipboard button.
 */
export function CodeBlock({ children, className, filename }: CodeBlockProps): React.JSX.Element {
  const [copied, setCopied] = useState<boolean>(false);

  // Extract raw text content from React children node
  const rawCode = typeof children === 'string' ? children : String(children ?? '').trim();
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'code';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error('Failed to copy code snippet to clipboard', err);
    }
  };

  return (
    <div className="relative my-6 rounded-lg border border-[var(--border)] bg-[#0d1117] text-[#c9d1d9] overflow-hidden font-mono text-sm shadow-md">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[var(--border)]/40 text-xs text-gray-400">
        <span className="font-semibold text-gray-300 uppercase tracking-wider">
          {filename || language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code>{rawCode}</code>
      </pre>
    </div>
  );
}
