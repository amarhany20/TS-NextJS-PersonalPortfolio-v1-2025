import { describe, expect, it } from 'vitest';
import { compileProjectMdx } from '@/server/services/mdx';

describe('MDX Compiler Service (compileProjectMdx)', () => {
  it('returns null for null, undefined, or empty strings', () => {
    expect(compileProjectMdx(null)).toBeNull();
    expect(compileProjectMdx(undefined)).toBeNull();
    expect(compileProjectMdx('')).toBeNull();
    expect(compileProjectMdx('   ')).toBeNull();
  });

  it('calculates reading time correctly', () => {
    const shortText = 'Hello world this is a short test.';
    const result = compileProjectMdx(shortText);
    expect(result).not.toBeNull();
    expect(result?.readingTimeMinutes).toBe(1);

    const longText = Array(450).fill('word').join(' ');
    const longResult = compileProjectMdx(longText);
    expect(longResult?.readingTimeMinutes).toBe(3);
  });

  it('compiles Markdown headings and text formatting', () => {
    const mdx = '# Major Title\n\n## Subtitle\n\n**Bold Text** and *Italic Text*';
    const result = compileProjectMdx(mdx);
    expect(result?.html).toContain(
      '<h1 class="text-2xl font-extrabold my-5 text-foreground">Major Title</h1>',
    );
    expect(result?.html).toContain(
      '<h2 class="text-xl font-bold my-4 text-foreground">Subtitle</h2>',
    );
    expect(result?.html).toContain('<strong>Bold Text</strong>');
    expect(result?.html).toContain('<em>Italic Text</em>');
  });

  it('compiles fenced code blocks with language tags', () => {
    const mdx = '```typescript\nconst x: number = 42;\n```';
    const result = compileProjectMdx(mdx);
    expect(result?.html).toContain(
      '<pre class="language-typescript"><code>const x: number = 42;</code></pre>',
    );
  });

  it('escapes unsafe script tags and HTML inside code blocks', () => {
    const mdx = '```html\n<script>alert("xss")</script>\n```';
    const result = compileProjectMdx(mdx);
    expect(result?.html).not.toContain('<script>alert');
    expect(result?.html).toContain('&lt;script&gt;');
  });

  it('compiles GitHub callout blockquotes', () => {
    const mdx = '> [!NOTE]\n> This is an important system note.';
    const result = compileProjectMdx(mdx);
    expect(result?.html).toContain('class="callout callout-note"');
    expect(result?.html).toContain('<strong>NOTE</strong>');
    expect(result?.html).toContain('This is an important system note.');
  });

  it('compiles links and list items', () => {
    const mdx = '[Google](https://google.com)\n\n- Feature 1\n- Feature 2';
    const result = compileProjectMdx(mdx);
    expect(result?.html).toContain('<a href="https://google.com"');
    expect(result?.html).toContain('<li class="ml-4 list-disc">Feature 1</li>');
  });
});
