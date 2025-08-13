/**
 * Metadata Shortcode System
 * WordPress-style shortcode processor for dynamic content
 */

import { prisma } from "@/lib/database";

interface ShortcodeOptions {
  fallback?: string;
  transform?: "uppercase" | "lowercase" | "capitalize" | "title";
  format?: "date" | "currency" | "list" | "json";
}

interface ParsedShortcode {
  key: string;
  options: ShortcodeOptions;
}

/**
 * Parse shortcode syntax: [meta:key.subkey|fallback,transform:uppercase,format:date]
 */
function parseShortcode(shortcode: string): ParsedShortcode | null {
  // Remove brackets and split by commas
  const content = shortcode.replace(/^\[|\]$/g, "");
  const parts = content.split(",");

  if (!parts[0] || !parts[0].startsWith("meta:")) {
    return null;
  }

  // Extract key (with potential fallback)
  const keyPart = parts[0].replace("meta:", "");
  const [key, fallback] = keyPart.split("|");

  // Parse options
  const options: ShortcodeOptions = {};
  if (fallback) options.fallback = fallback;

  parts.slice(1).forEach((part) => {
    const [optionKey, optionValue] = part.split(":");
    if (optionKey === "transform") {
      options.transform = optionValue as ShortcodeOptions["transform"];
    } else if (optionKey === "format") {
      options.format = optionValue as ShortcodeOptions["format"];
    }
  });

  return { key, options };
}

// Define types for metadata values
type MetadataValue = string | number | boolean | object | null | undefined;

/**
 * Apply transformations to a value
 */
function applyTransformations(value: MetadataValue, options: ShortcodeOptions): string {
  let result = String(value);

  // Apply format transformations
  if (options.format) {
    switch (options.format) {
      case "date":
        try {
          // Ensure value is string or number for Date
          result = new Date(String(value)).toLocaleDateString();
        } catch {
          result = String(value);
        }
        break;
      case "currency":
        try {
          result = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(parseFloat(String(value)));
        } catch {
          result = String(value);
        }
        break;
      case "list":
        try {
          const array = Array.isArray(value) ? value : JSON.parse(String(value));
          result = array.join(", ");
        } catch {
          result = String(value);
        }
        break;
      case "json":
        try {
          result = JSON.stringify(value, null, 2);
        } catch {
          result = String(value);
        }
        break;
    }
  }

  // Apply text transformations
  if (options.transform) {
    switch (options.transform) {
      case "uppercase":
        result = result.toUpperCase();
        break;
      case "lowercase":
        result = result.toLowerCase();
        break;
      case "capitalize":
        result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
        break;
      case "title":
        result = result
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
        break;
    }
  }

  return result;
}

/**
 * Get nested property from object using dot notation
 */
function getNestedProperty(obj: Record<string, MetadataValue>, path: string): MetadataValue {
  return path.split(".").reduce((current: Record<string, MetadataValue> | undefined, key) => {
    return current && current[key] !== undefined ? (current[key] as Record<string, MetadataValue>) : undefined;
  }, obj as Record<string, MetadataValue>);
}

/**
 * Cache for metadata to avoid repeated database queries
 */
class MetadataCache {
  private static instance: MetadataCache;
  private cache = new Map<string, MetadataValue>();
  private cacheExpiry = new Map<string, number>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): MetadataCache {
    if (!MetadataCache.instance) {
      MetadataCache.instance = new MetadataCache();
    }
    return MetadataCache.instance;
  }

  set(key: string, value: MetadataValue): void {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.TTL);
  }

  get(key: string): MetadataValue | null {
    const expiry = this.cacheExpiry.get(key);
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    return this.cache.get(key) || null;
  }

  clear(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

/**
 * Resolve a single metadata value by key
 */
async function resolveMetadataValue(key: string, options: ShortcodeOptions): Promise<string> {
  const cache = MetadataCache.getInstance();
  let cachedValue = cache.get(key);

  if (cachedValue === null) {
    try {
      const metadata = await prisma.metadata.findUnique({
        where: { key, isActive: true },
      });

      if (!metadata) {
        cachedValue = undefined;
      } else {
        // Parse the value based on type
        switch (metadata.type) {
          case "json":
            try {
              cachedValue = JSON.parse(metadata.value);
            } catch {
              cachedValue = metadata.value;
            }
            break;
          case "number":
            cachedValue = Number(metadata.value);
            break;
          case "boolean":
            cachedValue = metadata.value === "true";
            break;
          default:
            cachedValue = metadata.value;
        }
      }

      cache.set(key, cachedValue);
    } catch (error) {
      console.error(`Error fetching metadata for key ${key}:`, error);
      cachedValue = undefined;
    }
  }

  // Handle nested properties (e.g., "personal_addresses.primary")
  const propertyPath = key.split(".").slice(1);
  let finalValue = cachedValue;

  if (propertyPath.length > 0 && finalValue !== undefined && typeof finalValue === "object" && finalValue !== null) {
    finalValue = getNestedProperty(finalValue as Record<string, MetadataValue>, propertyPath.join("."));
  } // Use fallback if value is undefined
  if (finalValue === undefined || finalValue === null) {
    return options.fallback || "";
  }

  return applyTransformations(finalValue, options);
}

/**
 * Main shortcode processing function
 * Processes all shortcodes in a text string
 */
export async function processShortcodes(text: string): Promise<string> {
  if (!text || typeof text !== "string") {
    return text || "";
  }

  // Find all shortcodes in the text
  const shortcodeRegex = /\[meta:[^\]]+\]/g;
  const matches = text.match(shortcodeRegex);

  if (!matches) {
    return text;
  }

  // Process each shortcode
  let processedText = text;

  for (const match of matches) {
    const parsed = parseShortcode(match);
    if (parsed) {
      try {
        const resolvedValue = await resolveMetadataValue(parsed.key, parsed.options);
        processedText = processedText.replace(match, resolvedValue);
      } catch (error) {
        console.error(`Error processing shortcode ${match}:`, error);
        // Keep original shortcode if processing fails
      }
    }
  }

  return processedText;
}

/**
 * Process shortcodes in an object recursively
 */
export async function processShortcodesInObject(obj: MetadataValue): Promise<MetadataValue> {
  if (typeof obj === "string") {
    return await processShortcodes(obj);
  }

  if (Array.isArray(obj)) {
    return await Promise.all(obj.map(processShortcodesInObject));
  }

  if (obj && typeof obj === "object") {
    const result: Record<string, MetadataValue> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = await processShortcodesInObject(value);
    }
    return result;
  }

  return obj;
}

/**
 * Clear the metadata cache (useful for testing or when metadata changes)
 */
export function clearMetadataCache(): void {
  MetadataCache.getInstance().clear();
}

/**
 * Batch resolve multiple metadata keys (more efficient than individual calls)
 */
export async function batchResolveMetadata(keys: string[]): Promise<Record<string, MetadataValue>> {
  const cache = MetadataCache.getInstance();
  const uncachedKeys: string[] = [];
  const result: Record<string, MetadataValue> = {};

  // Check cache first
  for (const key of keys) {
    const cachedValue = cache.get(key);
    if (cachedValue !== null) {
      result[key] = cachedValue;
    } else {
      uncachedKeys.push(key);
    }
  }

  // Fetch uncached keys from database
  if (uncachedKeys.length > 0) {
    try {
      const metadata = await prisma.metadata.findMany({
        where: {
          key: { in: uncachedKeys },
          isActive: true,
        },
      });

      // Process and cache results
      for (const meta of metadata) {
        let value: MetadataValue;
        switch (meta.type) {
          case "json":
            try {
              value = JSON.parse(meta.value);
            } catch {
              value = meta.value;
            }
            break;
          case "number":
            value = Number(meta.value);
            break;
          case "boolean":
            value = meta.value === "true";
            break;
          default:
            value = meta.value;
        }

        result[meta.key] = value;
        cache.set(meta.key, value);
      }

      // Set undefined for keys not found in database
      for (const key of uncachedKeys) {
        if (!(key in result)) {
          result[key] = undefined;
          cache.set(key, undefined);
        }
      }
    } catch (error) {
      console.error("Error batch fetching metadata:", error);
    }
  }

  return result;
}

/**
 * Validate shortcode syntax
 */
export function validateShortcode(shortcode: string): boolean {
  const parsed = parseShortcode(shortcode);
  return parsed !== null;
}

/**
 * Extract all shortcode keys from a text
 */
export function extractShortcodeKeys(text: string): string[] {
  const shortcodeRegex = /\[meta:([^\],|]+)/g;
  const keys: string[] = [];
  let match;

  while ((match = shortcodeRegex.exec(text)) !== null) {
    keys.push(match[1]);
  }

  return [...new Set(keys)]; // Remove duplicates
}
