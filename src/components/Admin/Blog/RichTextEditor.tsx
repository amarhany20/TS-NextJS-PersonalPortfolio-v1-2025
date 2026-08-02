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
          toolbar: {
            container: [
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
            handlers: {
              image: imageHandler,
              link: linkHandler,
            },
          },
        },
      });

      quillRef.current = quill;
      quill.root.innerHTML = valueRef.current;
      quill.on('text-change', () => {
        onChangeRef.current(normalizeHtml(quill.root.innerHTML));
      });

      mountElement.querySelectorAll('[title]').forEach((el) => el.removeAttribute('title'));
    }

    async function imageHandler(this: unknown) {
      const toolbar = this as { quill: QuillType };
      const editor = toolbar.quill;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      document.body.appendChild(input);

      input.addEventListener('change', async () => {
        const file = input.files?.[0];
        input.remove();
        if (!file) {
          return;
        }

        try {
          const form = new FormData();
          form.append('file', file);

          const response = await fetch('/api/v1/media', { method: 'POST', body: form });
          const payload = await response.json().catch(() => null);
          if (!response.ok) {
            throw new Error(payload?.error?.message ?? 'Image upload failed.');
          }

          const url = payload?.data?.url as string | undefined;
          if (!url) {
            throw new Error('Upload returned no URL.');
          }

          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, 'image', url, 'user');
          editor.setSelection(range.index + 1, 0);
        } catch (error) {
          window.alert(error instanceof Error ? error.message : 'Image upload failed.');
        }
      });

      input.click();
    }

    function linkHandler(this: unknown, value: boolean) {
      const toolbar = this as { quill: QuillType };
      const editor = toolbar.quill;

      if (value) {
        const selection = editor.getSelection(true);
        const range = selection ?? { index: editor.getLength() - 1, length: 0 };
        const selectedText = editor.getText(range.index, range.length).trim();
        const href = window.prompt('Enter link URL (https://…):', selectedText || 'https://');
        if (href) {
          editor.format('link', href, 'user');
        }
        return;
      }

      editor.format('link', false, 'user');
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
