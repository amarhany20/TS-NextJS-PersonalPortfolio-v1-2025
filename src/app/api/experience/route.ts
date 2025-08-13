import { getExperience } from "@/lib/database-services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const experience = await getExperience();

    return NextResponse.json({
      success: true,
      data: experience,
      count: experience.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error - Experience:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch experience data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
