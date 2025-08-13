import { getCertificates } from "@/lib/database-services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const certificates = await getCertificates();

    return NextResponse.json({
      success: true,
      data: certificates,
      count: certificates.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error - Certificates:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch certificates data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
