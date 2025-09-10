/**
 * Experience Reorder API (single move)
 * POST /api/admin/experience/[id]/reorder
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-middleware";
import { prisma } from "@/lib/database";

export async function POST(request: NextRequest) {
  return requireRole(request, "USER", async () => {
    try {
      const pathname = request.nextUrl.pathname;
      const idSegment = pathname.split("/").filter(Boolean).slice(-2, -1)[0] || "";
      const id = parseInt(idSegment, 10);

      if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid experience ID" }, { status: 400 });
      }

      const body = await request.json();
      const direction = body?.direction === "up" ? "up" : body?.direction === "down" ? "down" : null;
      if (!direction) return NextResponse.json({ error: "Direction must be 'up' or 'down'" }, { status: 400 });

      const current = await prisma.experience.findUnique({ where: { id } });
      if (!current) return NextResponse.json({ error: "Experience not found" }, { status: 404 });

      // Find neighbor by displayOrder
      const neighbor = await prisma.experience.findFirst({
        where: direction === "up" ? { displayOrder: { lt: current.displayOrder } } : { displayOrder: { gt: current.displayOrder } },
        orderBy: { displayOrder: direction === "up" ? "desc" : "asc" },
      });

      if (!neighbor) {
        return NextResponse.json({ success: true });
      }

      // Swap displayOrder
      await prisma.$transaction([
        prisma.experience.update({ where: { id: current.id }, data: { displayOrder: neighbor.displayOrder } }),
        prisma.experience.update({ where: { id: neighbor.id }, data: { displayOrder: current.displayOrder } }),
      ]);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Reorder experience error:", error);
      return NextResponse.json({ error: "Failed to reorder experience" }, { status: 500 });
    }
  });
}
