import { getEducation } from "@/lib/database-services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const education = await getEducation();

    return NextResponse.json({
      success: true,
      data: education,
      count: education.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error - Education:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch education data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
