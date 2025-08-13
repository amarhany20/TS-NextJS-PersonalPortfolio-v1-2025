/**
 * Experience Delete API
 * DELETE /api/admin/experience/[id]
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-middleware";
import { prisma } from "@/lib/database";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return requireRole(request, "USER", async () => {
    try {
      const id = parseInt(params.id, 10);

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
