'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Avatar() {
  const [name] = useState<string>('Profile');
  const [imageUrl] = useState<string>('/2024 Ammar Personal Photo.jpg');

  // In static mode you may later hydrate from CMS or file-based config.
  useEffect(() => {
    // Placeholder – no async fetch
  }, []);

  return (
    <div className="rounded-full overflow-hidden w-24 h-24 mb-4 border-4 border-[var(--accent-primary)]">
      <Image
        src={imageUrl}
        alt={`${name} profile photo`}
        className="w-full h-full object-cover"
        width={96}
        height={96}
        priority
      />
    </div>
  );
}
