import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

/**
 * Parse text from a PDF document
 * @param buffer The PDF file buffer
 * @returns Extracted text from the PDF
 */
export async function parseDocumentText(buffer: Buffer): Promise<string> {
  try {
    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: "application/pdf" });
    
    // Use PDFLoader to extract text
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    
    // Combine all page content
    return docs.map(doc => doc.pageContent).join("\n\n");
  } catch (error) {
    console.error("Error parsing PDF document:", error);
    throw error;
  }
}
