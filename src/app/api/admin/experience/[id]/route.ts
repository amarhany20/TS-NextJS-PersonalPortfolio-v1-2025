/**
 * Experience Delete API
 * DELETE /api/admin/experience/[id]
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-middleware";
import { prisma } from "@/lib/database";

// Use single-arg handler to avoid type inference issues and read id from URL
export async function DELETE(request: NextRequest) {
  return requireRole(request, "USER", async () => {
    try {
  const pathname = request.nextUrl.pathname;
  const idSegment = pathname.split("/").pop() || "";
  const id = parseInt(idSegment, 10);

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
