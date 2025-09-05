"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api-client";

export default function Avatar() {
  const [name, setName] = useState<string>("Profile");
  const [imageUrl, setImageUrl] = useState<string>("/2024 Ammar Personal Photo.jpg");

  useEffect(() => {
    let mounted = true;
    Promise.all([
      apiService.getMetadataByKey("fullName"),
      apiService.getMetadataByKey("profileImageUrl"),
    ])
      .then(([nameRes, imageRes]) => {
        if (!mounted) return;
        const n = nameRes?.data?.value;
        if (typeof n === "string" && n.trim()) setName(n);
        const img = imageRes?.data?.value;
        if (typeof img === "string" && img.trim()) setImageUrl(img);
      })
      .catch(() => void 0);
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rounded-full overflow-hidden w-24 h-24 mb-4 border-4 border-[var(--accent-primary)]">
      <Image src={imageUrl} alt={`${name} profile photo`} className="w-full h-full object-cover" width={96} height={96} priority />
    </div>
  );
}
