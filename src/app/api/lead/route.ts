import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = body.subject ? String(body.subject).trim() : null;
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: { name, email, subject: subject || undefined, message },
    });

    return NextResponse.json({ success: true, data: { id: lead.id } }, { status: 201 });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ success: false, error: "Failed to create lead" }, { status: 500 });
  }
}
