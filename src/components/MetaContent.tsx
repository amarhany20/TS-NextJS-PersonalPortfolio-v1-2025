'use client';
import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

// Simple static key->content mapping (extend as needed)
const STATIC_META: Record<string, string> = {
  heroDescription:
    'I build performant, maintainable full‑stack solutions with a focus on developer experience and reliable delivery.',
};

type IntrinsicTag = keyof React.JSX.IntrinsicElements;
type MetaContentProps = {
  keyName: string;
  as?: IntrinsicTag;
  className?: string;
  fallback?: string;
};

export default function MetaContent({
  keyName,
  as = 'div',
  className,
  fallback = '',
}: MetaContentProps) {
  const Tag = as as keyof React.JSX.IntrinsicElements;
  const raw = STATIC_META[keyName] || fallback;
  if (!raw) return null;
  const html = DOMPurify.sanitize(raw);
  return React.createElement(Tag as React.ElementType, {
    className,
    dangerouslySetInnerHTML: { __html: html },
  });
}
