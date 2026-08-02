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
 *
 * The editor is initialised exactly once on mount. Parent value changes are applied through a
 * separate effect that writes straight into the Quill root, so typing never re-creates the
 * instance (which used to stack duplicate toolbars). Cleanup removes Quill's injected
 * `.ql-toolbar` sibling and resets the container so a StrictMode double-mount starts clean.
 */
export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const placeholderRef = useRef(placeholder);
  placeholderRef.current = placeholder;
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    let mounted = true;
    const container = editorRef.current;
    if (!container) {
      return;
    }

    const mountElement: HTMLElement = container;

    async function init() {
      const Quill = (await import('quill')).default;
      if (!mounted || quillRef.current) {
        return;
      }

      const quill = new Quill(mountElement, {
        theme: 'snow',
        placeholder: placeholderRef.current,
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

      quillRef.current = quill;
      quill.root.innerHTML = valueRef.current;
      quill.on('text-change', () => {
        onChangeRef.current(normalizeHtml(quill.root.innerHTML));
      });
    }

    void init();

    return () => {
      mounted = false;
      const quill = quillRef.current;
      quillRef.current = null;

      if (quill) {
        quill.off('text-change');
      }

      const toolbar = container.previousElementSibling;
      if (toolbar && toolbar.classList.contains('ql-toolbar')) {
        toolbar.remove();
      }
      container.classList.remove('ql-container', 'ql-snow');
      container.innerHTML = '';
    };
    // Initialise once. onChange/placeholder/value are read through refs to avoid
    // re-creating the editor on every keystroke.
  }, []);

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
