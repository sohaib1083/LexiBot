import { NextRequest, NextResponse } from "next/server";
import { createVectorStore } from "@/lib/vector-db";
import { parseDocumentText } from "@/lib/document-parser";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    // Process form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check if it's a PDF file (temporarily allow .txt for testing)
    if (!file.name.toLowerCase().endsWith(".pdf") && !file.name.toLowerCase().endsWith(".txt")) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // Extract text from the document
    let documentText;
    if (file.name.toLowerCase().endsWith(".txt")) {
      // For text files, just read the content directly
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      documentText = fileBuffer.toString('utf-8');
    } else {
      // For PDF files, use the parser
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      documentText = await parseDocumentText(fileBuffer);
    }

    if (!documentText) {
      return NextResponse.json(
        { error: "Failed to extract text from the document" },
        { status: 400 }
      );
    }

    // Create a vector store from the document
    const vectorStoreId = await createVectorStore(documentText, file.name);

    return NextResponse.json({
      success: true,
      vectorStoreId: vectorStoreId,
    });
  } catch (error) {
    console.error("Error in /api/upload route:", error);
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 }
    );
  }
}
