/**
 * Experience API
 * Manage work experiences
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-middleware";
import { prisma } from "@/lib/database";
import { z } from "zod";

// Validation schema
const experienceSchema = z.object({
  id: z.number().optional(),
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  duration: z.string().min(1, "Duration is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  companyUrl: z.string().url().optional(),
});

// GET /api/admin/experience - Get all experiences
export async function GET(request: NextRequest) {
  return requireRole(request, "USER", async () => {
    try {
      const experiences = await prisma.experience.findMany({
        orderBy: [{ createdAt: "desc" }],
      });

      return NextResponse.json({
        success: true,
        data: experiences,
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
      const validatedData = experienceSchema.parse(body);

      const experience = await prisma.experience.create({
        data: {
          company: validatedData.company,
          position: validatedData.position,
          duration: validatedData.duration,
          location: validatedData.location,
          type: validatedData.type,
          description: validatedData.description,
          achievements: JSON.stringify(validatedData.achievements),
          skills: JSON.stringify(validatedData.skills),
          companyUrl: validatedData.companyUrl,
        },
      });

      return NextResponse.json({
        success: true,
        data: experience,
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
      const validatedData = experienceSchema.parse(body);

      if (!validatedData.id) {
        return NextResponse.json({ error: "Experience ID is required for update" }, { status: 400 });
      }

      const experience = await prisma.experience.update({
        where: { id: validatedData.id },
        data: {
          company: validatedData.company,
          position: validatedData.position,
          duration: validatedData.duration,
          location: validatedData.location,
          type: validatedData.type,
          description: validatedData.description,
          achievements: JSON.stringify(validatedData.achievements),
          skills: JSON.stringify(validatedData.skills),
          companyUrl: validatedData.companyUrl,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        data: experience,
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
