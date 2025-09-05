"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    // Dynamically import package.json at runtime in the client bundle
    // Handle both ESM default and CommonJS shapes
    import("../../../package.json")
      .then((mod: { default?: { version?: string }; version?: string }) => {
        const pkg = (mod && (mod.default ?? mod)) as { version?: string };
        const raw: string = pkg?.version || "";
        setVersion(String(raw).trim());
      })
      .catch(() => setVersion(""));
  }, []);

  return (
    <footer className="mt-6 text-[10px] text-center text-[var(--text-secondary)]">
      {version ? <span>v{version}</span> : null}
    </footer>
  );
}
