import { getRecommendations } from "@/lib/database-services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const recommendations = await getRecommendations();

    return NextResponse.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error - Recommendations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch recommendations data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
