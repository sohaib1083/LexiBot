import { NextRequest, NextResponse } from "next/server";
import { querySimilarDocs, askQuestion } from "@/lib/vector-db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vectorStoreId, question, language = "english" } = body;

    if (!vectorStoreId || !question) {
      return NextResponse.json(
        { error: "Missing required fields: vectorStoreId and question" },
        { status: 400 }
      );
    }

    // Get AI response based on the document and question
    const response = await askQuestion(vectorStoreId, question, language);

    return NextResponse.json({ answer: response });
  } catch (error) {
    console.error("Error in /api/ask route:", error);
    return NextResponse.json(
      { error: "Failed to process your question" },
      { status: 500 }
    );
  }
}
