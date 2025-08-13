import { prisma } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const key = searchParams.get("key");

    if (key) {
      // Get specific metadata by key
      const metadata = await prisma.metadata.findUnique({
        where: { key, isActive: true },
      });

      if (!metadata) {
        return NextResponse.json({ success: false, error: "Metadata not found" }, { status: 404 });
      }

      // Parse value based on type
      let parsedValue;
      try {
        if (metadata.type === "json") {
          parsedValue = JSON.parse(metadata.value);
        } else if (metadata.type === "number") {
          parsedValue = Number(metadata.value);
        } else if (metadata.type === "boolean") {
          parsedValue = metadata.value === "true";
        } else {
          parsedValue = metadata.value;
        }
      } catch (error) {
        console.error(`Error parsing metadata for key ${metadata.key}:`, error);
        parsedValue = metadata.value;
      }

      return NextResponse.json({
        success: true,
        data: {
          key: metadata.key,
          value: parsedValue,
          type: metadata.type,
          category: metadata.category,
          description: metadata.description,
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (category) {
      // Get all metadata by category
      const metadata = await prisma.metadata.findMany({
        where: {
          category,
          isActive: true,
        },
        orderBy: { key: "asc" },
      });

      // Transform to key-value object
      const result: Record<string, unknown> = {};
      metadata.forEach((meta) => {
        try {
          if (meta.type === "json") {
            result[meta.key] = JSON.parse(meta.value);
          } else if (meta.type === "number") {
            result[meta.key] = Number(meta.value);
          } else if (meta.type === "boolean") {
            result[meta.key] = meta.value === "true";
          } else {
            result[meta.key] = meta.value;
          }
        } catch (error) {
          console.error(`Error parsing metadata for key ${meta.key}:`, error);
          result[meta.key] = meta.value;
        }
      });

      return NextResponse.json({
        success: true,
        data: result,
        count: metadata.length,
        timestamp: new Date().toISOString(),
      });
    }

    // Get all metadata
    const allMetadata = await prisma.metadata.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: allMetadata,
      count: allMetadata.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error - Metadata:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch metadata",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
