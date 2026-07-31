import React from 'react';

export interface ImageGridProps {
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
}

/**
 * ImageGrid Component for MDX Content
 *
 * Renders responsive multi-column image layouts inside portfolio case studies.
 */
export function ImageGrid({ columns = 2, children }: ImageGridProps): React.JSX.Element {
  const colClass =
    columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
      : columns === 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2';

  return <div className={`grid gap-4 my-6 ${colClass}`}>{children}</div>;
}
