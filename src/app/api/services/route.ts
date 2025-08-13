import { getServices } from "@/lib/database-services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await getServices();

    return NextResponse.json({
      success: true,
      data: services,
      count: services.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error - Services:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch services data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
