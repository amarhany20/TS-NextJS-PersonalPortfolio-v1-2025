import DOMPurify from 'isomorphic-dompurify';

import { logger } from '@/utils/logger';

export interface CompiledMdxResult {
  /** Raw Markdown/MDX source text */
  source: string;
  /** Processed HTML string for public rendering */
  html: string;
  /** Estimated reading time in minutes */
  readingTimeMinutes: number;
}

/**
 * Parses and compiles raw MDX/Markdown text into sanitized HTML for public rendering.
 * Transforms code blocks, GitHub alert blockquotes (> [!NOTE]), headings, lists, links, and emphasis.
 *
 * @param source Raw MDX or Markdown string
 */
export function compileProjectMdx(source?: string | null): CompiledMdxResult | null {
  if (!source || !source.trim()) {
    return null;
  }

  try {
    const trimmed = source.trim();
    // Estimate reading time (average 200 words per minute)
    const wordCount = trimmed.split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    let html = trimmed;

    // 1. Transform Fenced Code Blocks (```lang ... ```) FIRST so code samples (e.g. HTML snippets) are safely escaped
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang = 'code', code = '') => {
      const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre class="language-${lang}"><code>${escapedCode.trim()}</code></pre>`;
    });

    // 2. Escape raw unescaped <script> tags outside code blocks
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // 3. Transform GitHub alert blockquotes (> [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING])
    html = html.replace(
      />\s*\[!(NOTE|TIP|IMPORTANT|WARNING)\]\s*\n([\s\S]*?)(?=\n\n|\n$|$)/gi,
      (_, type: string, content: string) => {
        const lowerType = type.toLowerCase();
        const cleanContent = content.replace(/^>\s?/gm, '').trim();
        return `<div data-callout="${lowerType}" class="callout callout-${lowerType}"><strong>${type}</strong><p>${cleanContent}</p></div>`;
      },
    );

    // 4. Transform Inline Code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // 5. Transform Headings (#, ##, ###)
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-semibold my-3 text-foreground">$1</h3>',
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-bold my-4 text-foreground">$1</h2>',
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-extrabold my-5 text-foreground">$1</h1>',
    );

    // 6. Transform Bold & Italic (*text*, **text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 7. Transform Links ([text](url))
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline font-medium">$1</a>',
    );

    // 8. Transform Unordered Lists (- item)
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc">$1</li>');

    // Wrap adjacent list items in <ul>
    html = html.replace(
      /(<li[\s\S]*?<\/li>\n?)+/g,
      '<ul class="my-3 space-y-1 text-sm text-[var(--text-secondary)]">$&</ul>',
    );

    // Sanitize the final HTML so arbitrary CMS-authored HTML (e.g. <img
    // onerror>, <iframe>, javascript: links) cannot execute when rendered via
    // dangerouslySetInnerHTML. The regex transforms above handle Markdown
    // shapes; DOMPurify strips any dangerous HTML/schemes that slip through.
    html = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

    return {
      source: trimmed,
      html,
      readingTimeMinutes,
    };
  } catch (error) {
    logger.error('Failed to compile MDX content', error);
    return {
      source: source || '',
      html: `<p class="text-red-400 font-mono text-sm">Failed to render MDX section.</p>`,
      readingTimeMinutes: 1,
    };
  }
}
