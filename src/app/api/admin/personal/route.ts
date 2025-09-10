/**
 * Personal Information API
 * Manage personal info and metadata
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-middleware";
import { prisma } from "@/lib/database";
import { z } from "zod";

// Validation schema
const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  displayName: z.string().min(1, "Display name is required"),
  title: z.string().min(1, "Title is required"),
  emails: z.object({
    primary: z.string().email(),
    professional: z.string().email().optional(),
  }),
  phones: z.record(z.string(), z.string()),
  addresses: z.record(z.string(), z.string()),
  website: z.string().url().optional(),
  availability: z.string(),
  relocationStatus: z.string(),
  professionalSummary: z.string(),
  careerObjective: z.string(),
});

// Helper to convert snake_case to camelCase
function toCamel(s: string) {
  return s.replace(/[_-](\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

function normalizeKey(key: string): string {
  if (key.startsWith("personal_")) return toCamel(key.replace(/^personal_/, ""));
  if (key.startsWith("professional_")) return toCamel(key.replace(/^professional_/, ""));
  return toCamel(key);
}

// GET /api/admin/personal - Get personal information
export async function GET(request: NextRequest) {
  return requireRole(request, "USER", async () => {
    try {
      const personalInfo = await prisma.metadata.findMany({
        where: {
          category: { in: ["personal", "professional"] },
          isActive: true,
        },
        orderBy: { key: "asc" },
      });

      // Transform metadata into structured object
      const info = personalInfo.reduce((acc, item) => {
        const mainKey = normalizeKey(item.key);
        if (!mainKey) return acc;
        try {
          acc[mainKey] = item.type === "json" ? JSON.parse(item.value) : item.value;
        } catch {
          acc[mainKey] = item.value;
        }
        return acc;
      }, {} as Record<string, unknown>);

      return NextResponse.json({
        success: true,
        data: info,
      });
    } catch (error) {
      console.error("Get personal info error:", error);
      return NextResponse.json({ error: "Failed to fetch personal information" }, { status: 500 });
    }
  });
}

// PUT /api/admin/personal - Update personal information
export async function PUT(request: NextRequest) {
  return requireRole(request, "USER", async () => {
    try {
      const body = await request.json();
      const validatedData = personalInfoSchema.parse(body);

      // Update metadata entries
      const updates = [
        { key: "personal_name", value: validatedData.name, type: "string" },
        { key: "personal_display_name", value: validatedData.displayName, type: "string" },
        { key: "personal_title", value: validatedData.title, type: "string" },
        { key: "personal_emails", value: JSON.stringify(validatedData.emails), type: "json" },
        { key: "personal_phones", value: JSON.stringify(validatedData.phones), type: "json" },
        { key: "personal_addresses", value: JSON.stringify(validatedData.addresses), type: "json" },
        { key: "personal_website", value: validatedData.website || "", type: "string" },
        { key: "personal_availability", value: validatedData.availability, type: "string" },
        { key: "personal_relocation_status", value: validatedData.relocationStatus, type: "string" },
        { key: "professional_summary", value: validatedData.professionalSummary, type: "string" },
        { key: "career_objective", value: validatedData.careerObjective, type: "string" },
        { key: "last_updated", value: new Date().toISOString(), type: "string" },
      ];

      // Update all metadata entries
      for (const update of updates) {
        await prisma.metadata.upsert({
          where: { key: update.key },
          update: {
            value: update.value,
            type: update.type,
            updatedAt: new Date(),
          },
          create: {
            key: update.key,
            value: update.value,
            type: update.type,
            category: update.key.startsWith("personal_") ? "personal" : "professional",
            subcategory: "basic",
            description: `Auto-generated from personal info update`,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Personal information updated successfully",
      });
    } catch (error) {
      console.error("Update personal info error:", error);

      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
      }

      return NextResponse.json({ error: "Failed to update personal information" }, { status: 500 });
    }
  });
}
