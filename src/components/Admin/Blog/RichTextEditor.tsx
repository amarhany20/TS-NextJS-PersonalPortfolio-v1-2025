'use client';

import { useEffect, useRef } from 'react';
import type QuillType from 'quill';
import 'quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Lightweight Quill wrapper so we can keep the blog editor dependency-free apart from Quill itself.
 * We intentionally avoid react-quill to reduce bundle size and keep tight control over SSR guards.
 */
export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!editorRef.current) {
        return;
      }

      const Quill = (await import('quill')).default;
      if (!mounted || quillRef.current) {
        return;
      }

      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['link', 'image', 'blockquote', 'code-block'],
            [{ color: [] }, { background: [] }],
            ['clean'],
          ],
        },
      });

      quillRef.current.root.innerHTML = value;
      quillRef.current.on('text-change', () => {
        const html = quillRef.current?.root.innerHTML ?? '';
        onChange(normalizeHtml(html));
      });
    }

    init();

    return () => {
      mounted = false;
      quillRef.current?.off('text-change');
      quillRef.current = null;
    };
  }, [onChange, placeholder, value]);

  useEffect(() => {
    const editor = quillRef.current;
    if (editor && normalizeHtml(editor.root.innerHTML) !== normalizeHtml(value)) {
      editor.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card-bg)]" ref={editorRef} />
  );
}

function normalizeHtml(html: string) {
  if (!html) {
    return '';
  }

  return html.replace(/<p><br\/?><\/p>$/i, '').trim();
}
