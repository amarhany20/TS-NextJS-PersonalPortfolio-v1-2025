import React from 'react';
import { CodeBlock } from './CodeBlock';
import { Callout } from './Callout';
import { ImageGrid } from './ImageGrid';

export { CodeBlock, Callout, ImageGrid };

/**
 * Standard component mapping object used by MDX compilers and renderers.
 */
export const mdxComponentMap = {
  CodeBlock,
  Callout,
  ImageGrid,
  pre: ({ children, className }: React.HTMLAttributes<HTMLPreElement>) => (
    <div className={className}>{children}</div>
  ),
  code: ({ children, className }: React.HTMLAttributes<HTMLElement>) => {
    // If inside a code block, render custom CodeBlock
    if (className?.includes('language-')) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    // Inline code snippet
    return (
      <code className="px-1.5 py-0.5 rounded bg-[var(--border)]/30 text-primary font-mono text-xs">
        {children}
      </code>
    );
  },
};
