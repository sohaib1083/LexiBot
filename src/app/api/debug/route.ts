import { NextRequest, NextResponse } from "next/server";
import { getCacheStatus } from "@/lib/vector-db";

export async function GET(request: NextRequest) {
  try {
    const cacheStatus = getCacheStatus();
    
    return NextResponse.json({
      message: "Debug endpoint - vector store cache status",
      ...cacheStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json(
      { error: "Debug endpoint error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
