/**
 * Experience Bulk Reorder API
 * POST /api/admin/experience/reorder
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-middleware";
import { prisma } from "@/lib/database";

export async function POST(request: NextRequest) {
  return requireRole(request, "USER", async () => {
    try {
      const body = await request.json();
      const orderedIds: number[] = Array.isArray(body?.orderedIds) ? body.orderedIds : [];
      if (!orderedIds.length) return NextResponse.json({ error: "orderedIds is required" }, { status: 400 });

      // Normalize to sequential displayOrder starting from 0
      const updates = orderedIds.map((id, index) =>
        prisma.experience.update({ where: { id }, data: { displayOrder: index } })
      );
      await prisma.$transaction(updates);

      const refreshed = await prisma.experience.findMany({ orderBy: [{ displayOrder: "asc" }] });
      return NextResponse.json({ success: true, data: refreshed });
    } catch (error) {
      console.error("Bulk reorder experiences error:", error);
      return NextResponse.json({ error: "Failed to reorder experiences" }, { status: 500 });
    }
  });
}
