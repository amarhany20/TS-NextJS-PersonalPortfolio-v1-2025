import { getLanguages } from "@/lib/database-services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const languages = await getLanguages();

    return NextResponse.json({
      success: true,
      data: languages,
      count: languages.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error - Languages:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch languages data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
