/**
 * Experience API
 * Manage work experiences
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-middleware";
import { prisma } from "@/lib/database";
import { z } from "zod";
import type { Experience as PrismaExperience } from "@prisma/client";

// Helpers
const safeParseArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? (parsed as string[]) : [trimmed];
    } catch {
      // Not JSON, treat as single-item array
      return [trimmed];
    }
  }
  return [];
};

// Validation schemas (accept legacy DB shape or new UI shape)
const uiExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional().default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  current: z.boolean().optional().default(false),
  description: z.string().optional().default(""),
  responsibilities: z.array(z.string()).optional().default([]),
  achievements: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  projectHighlights: z.array(z.string()).optional().default([]),
  displayOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
  companyUrl: z.string().url().optional(),
});

const dbExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  duration: z.string().min(1, "Duration is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().optional().default(""),
  achievements: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  displayOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
  companyUrl: z.string().url().optional(),
});

type UiExperience = z.infer<typeof uiExperienceSchema>;
type DbExperienceInput = z.infer<typeof dbExperienceSchema>;

type AdminExperienceApi = {
  id: number;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  projectHighlights: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

const toAdminShape = (e: PrismaExperience): AdminExperienceApi => ({
  id: e.id,
  company: e.company,
  position: e.position,
  location: e.location,
  startDate: "", // Not available in DB; can be derived from duration with future enhancement
  endDate: "",
  current: typeof e.duration === "string" ? e.duration.toLowerCase().includes("present") : false,
  description: e.description || "",
  responsibilities: [],
  achievements: safeParseArray(e.achievements),
  technologies: safeParseArray(e.skills),
  projectHighlights: [],
  displayOrder: e.displayOrder ?? 0,
  isActive: e.isActive ?? true,
  createdAt: e.createdAt,
  updatedAt: e.updatedAt,
});

function toDbInput(payload: unknown): DbExperienceInput {
  // Try UI shape first
  const parsedUi = uiExperienceSchema.safeParse(payload);
  if (parsedUi.success) {
    const v: UiExperience = parsedUi.data;
    let duration = "";
    if (v.startDate) {
      duration = v.current ? `${v.startDate} - Present` : v.endDate ? `${v.startDate} - ${v.endDate}` : v.startDate;
    } else if (typeof payload === "object" && payload && typeof (payload as Record<string, unknown>)["duration"] === "string") {
      duration = (payload as Record<string, unknown>)["duration"] as string;
    } else {
      duration = "";
    }
    return {
      company: v.company,
      position: v.position,
      location: v.location || "",
      type: typeof payload === "object" && payload && typeof (payload as Record<string, unknown>)["type"] === "string" && (payload as Record<string, unknown>)["type"]
        ? ((payload as Record<string, unknown>)["type"] as string)
        : "Full-time",
      duration,
      description: v.description || "",
      achievements: v.achievements ?? [],
      skills: v.technologies ?? [],
      displayOrder: v.displayOrder ?? 0,
      isActive: v.isActive ?? true,
      companyUrl: v.companyUrl,
    };
  }

  // Fallback to DB shape
  const parsedDb = dbExperienceSchema.parse(payload);
  return parsedDb;
}

// GET /api/admin/experience - Get all experiences
export async function GET(request: NextRequest) {
  return requireRole(request, "USER", async () => {
    try {
      const experiences = await prisma.experience.findMany({
        orderBy: [
          { displayOrder: "asc" },
          { createdAt: "desc" },
        ],
      });

      const data = experiences.map(toAdminShape);

      return NextResponse.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Get experiences error:", error);
      return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
    }
  });
}

// POST /api/admin/experience - Create new experience
export async function POST(request: NextRequest) {
  return requireRole(request, "USER", async () => {
    try {
      const body = await request.json();
      const normalized = toDbInput(body);

      const experience = await prisma.experience.create({
        data: {
          company: normalized.company,
          position: normalized.position,
          duration: normalized.duration,
          location: normalized.location,
          type: normalized.type,
          description: normalized.description || "",
          achievements: JSON.stringify(normalized.achievements ?? []),
          skills: JSON.stringify(normalized.skills ?? []),
          companyUrl: normalized.companyUrl,
          displayOrder: normalized.displayOrder ?? 0,
          isActive: normalized.isActive ?? true,
        },
      });

      return NextResponse.json({
        success: true,
        data: toAdminShape(experience),
        message: "Experience created successfully",
      });
    } catch (error) {
      console.error("Create experience error:", error);
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
    }
  });
}

// PUT /api/admin/experience - Update experience
export async function PUT(request: NextRequest) {
  return requireRole(request, "USER", async () => {
    try {
      const body = await request.json();
      const id = typeof body?.id === "number" ? body.id : NaN;
      if (!id || Number.isNaN(id)) {
        return NextResponse.json({ error: "Experience ID is required for update" }, { status: 400 });
      }

      const normalized = toDbInput(body);

      const experience = await prisma.experience.update({
        where: { id },
        data: {
          company: normalized.company,
          position: normalized.position,
          duration: normalized.duration,
          location: normalized.location,
          type: normalized.type,
          description: normalized.description || "",
          achievements: JSON.stringify(normalized.achievements ?? []),
          skills: JSON.stringify(normalized.skills ?? []),
          companyUrl: normalized.companyUrl,
          displayOrder: normalized.displayOrder ?? 0,
          isActive: normalized.isActive ?? true,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        data: toAdminShape(experience),
        message: "Experience updated successfully",
      });
    } catch (error) {
      console.error("Update experience error:", error);
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
      }
      return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
    }
  });
}

// DELETE /api/admin/experience/[id] - Delete experience
export async function DELETE(request: NextRequest) {
  return requireRole(request, "USER", async () => {
    try {
      const url = new URL(request.url);
      const idStr = url.pathname.split("/").pop();

      if (!idStr) {
        return NextResponse.json({ error: "Experience ID is required" }, { status: 400 });
      }

      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid experience ID" }, { status: 400 });
      }

      await prisma.experience.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "Experience deleted successfully",
      });
    } catch (error) {
      console.error("Delete experience error:", error);
      return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
    }
  });
}
