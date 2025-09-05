import { NextRequest, NextResponse } from "next/server";

// Placeholder register endpoint. Implement actual user registration when needed.
export async function POST(_req: NextRequest) {
	return NextResponse.json({ success: false, message: "Registration endpoint not implemented" }, { status: 501 });
}

