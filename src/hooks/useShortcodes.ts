/**
 * React Hook for processing shortcodes
 */

"use client";

import { useState, useEffect } from "react";
import { processShortcodes } from "@/lib/shortcodes";

export function useShortcodes(text: string): { processedText: string; loading: boolean } {
  const [processedText, setProcessedText] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!text || typeof text !== "string") {
      setProcessedText(text || "");
      return;
    }

    const hasShortcodes = /\[meta:[^\]]+\]/.test(text);
    if (!hasShortcodes) {
      setProcessedText(text);
      return;
    }

    setLoading(true);
    processShortcodes(text)
      .then(setProcessedText)
      .catch((error) => {
        console.error("Error processing shortcodes:", error);
        setProcessedText(text); // Fallback to original text
      })
      .finally(() => setLoading(false));
  }, [text]);

  return { processedText, loading };
}
