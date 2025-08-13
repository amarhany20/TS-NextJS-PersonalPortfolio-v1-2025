import { getSkills, getCoreSkills } from "@/lib/database-services";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const coreOnly = searchParams.get("core") === "true";

    if (coreOnly) {
      // Get only core skills
      const coreSkills = await getCoreSkills();

      return NextResponse.json({
        success: true,
        data: coreSkills,
        count: coreSkills.length,
        timestamp: new Date().toISOString(),
      });
    }

    // Get all skills organized by categories
    const skills = await getSkills();

    return NextResponse.json({
      success: true,
      data: skills,
      count: Object.keys(skills).length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error - Skills:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch skills data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
