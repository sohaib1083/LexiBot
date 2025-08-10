import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import path from "path";
import fs from "fs";

// In-memory storage for documents (will be lost on server restart but works for serverless)
// In production, you'd want to use a database like Supabase, PlanetScale, etc.
const documentCache = new Map<string, {
  text: string;
  documentId: string;
  chunks: Array<{
    id: number;
    content: string;
    metadata: any;
    embedding: number[];
  }>;
  createdAt: string;
}>();

// Directory for storing vector databases (fallback for local development)
const VECTOR_STORE_DIR = process.env.NODE_ENV === 'production' 
  ? '/tmp/vector-stores'
  : path.join(process.cwd(), "vector-stores");
const DOCUMENT_STORE_DIR = process.env.NODE_ENV === 'production'
  ? '/tmp/document-stores'  
  : path.join(process.cwd(), "document-stores");

// Create the directory if it doesn't exist
if (!fs.existsSync(VECTOR_STORE_DIR)) {
  fs.mkdirSync(VECTOR_STORE_DIR, { recursive: true });
}

// Groq API constants
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile"; 
/**
 * Simple function to create embeddings using a basic text representation
 */
function createSimpleEmbedding(text: string): number[] {
  const embedding = new Array(384).fill(0);
  const words = text.toLowerCase().split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length; j++) {
      const charCode = word.charCodeAt(j);
      const index = (charCode + i + j) % 384;
      embedding[index] += 1;
    }
  }
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
}

/**
 * Simple cosine similarity calculation
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return mag1 && mag2 ? dotProduct / (mag1 * mag2) : 0;
}

/**
 * Process document text and store it in memory and optionally in file system
 */
export async function createVectorStore(text: string, documentId: string): Promise<string> {
  try {
    console.log("createVectorStore called with text length:", text.length);
    
    // Check if required environment variables are available
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    
    // Create a unique ID for the vector store
    const vectorStoreId = uuidv4();
    
    console.log("Creating vector store with ID:", vectorStoreId);

    // Split the text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    console.log("Splitting text into chunks...");
    const splitDocs = await textSplitter.createDocuments([text], [{ documentId }]);
    console.log("Created", splitDocs.length, "chunks");
    
    // Create vector store data with embeddings
    const chunks = splitDocs.map((doc, index) => ({
      id: index,
      content: doc.pageContent,
      metadata: doc.metadata,
      embedding: createSimpleEmbedding(doc.pageContent)
    }));

    const vectorData = {
      text: text, // Store original text for regeneration if needed
      documentId,
      chunks,
      createdAt: new Date().toISOString()
    };

    // Store in memory cache (primary storage for Vercel)
    documentCache.set(vectorStoreId, vectorData);
    console.log("Vector store cached in memory for ID:", vectorStoreId);

    // Also try to save to file system for local development
    try {
      const vectorStorePath = path.join(VECTOR_STORE_DIR, `${vectorStoreId}.json`);
      
      // Ensure directory exists
      if (!fs.existsSync(VECTOR_STORE_DIR)) {
        console.log("Creating vector store directory:", VECTOR_STORE_DIR);
        fs.mkdirSync(VECTOR_STORE_DIR, { recursive: true });
      }

      fs.writeFileSync(vectorStorePath, JSON.stringify(vectorData, null, 2));
      console.log("Vector store also saved to file system");
    } catch (fileError) {
      console.log("File system storage failed (expected in production):", (fileError as Error).message);
    }

    return vectorStoreId;
  } catch (error) {
    console.error("Error in createVectorStore:", error);
    throw new Error(`Failed to create vector store: ${(error as Error).message}`);
  }
}

/**
 * Query for similar documents from the vector store
 */
export async function querySimilarDocs(vectorStoreId: string, query: string, limit: number = 3): Promise<string[]> {
  try {
    console.log("Querying vector store:", vectorStoreId);
    
    let vectorData: any = null;
    
    // First, try to get from memory cache
    if (documentCache.has(vectorStoreId)) {
      vectorData = documentCache.get(vectorStoreId);
      console.log("Found vector store in memory cache");
    } else {
      console.log("Vector store not found in memory, trying file system...");
      
      // Fallback to file system (for local development or if files persist)
      let vectorStorePath = path.join(VECTOR_STORE_DIR, `${vectorStoreId}.json`);
      
      // Check both vector-stores and document-stores directories
      if (!fs.existsSync(vectorStorePath)) {
        vectorStorePath = path.join(DOCUMENT_STORE_DIR, `${vectorStoreId}.json`);
      }
      
      if (fs.existsSync(vectorStorePath)) {
        console.log("Reading vector store from file:", vectorStorePath);
        vectorData = JSON.parse(fs.readFileSync(vectorStorePath, 'utf8'));
        
        // Cache it in memory for future use
        documentCache.set(vectorStoreId, vectorData);
        console.log("Cached vector store in memory from file");
      }
    }
    
    if (!vectorData) {
      console.error("Vector store not found in memory or file system for ID:", vectorStoreId);
      console.log("Available cache keys:", Array.from(documentCache.keys()));
      throw new Error(`Vector store ${vectorStoreId} not found. Please upload your document again.`);
    }

    console.log("Processing", vectorData.chunks?.length || 0, "chunks");
    
    const queryEmbedding = createSimpleEmbedding(query);
    
    // Calculate similarities and sort
    const similarities = vectorData.chunks.map((chunk: any) => {
      // Generate embedding if it doesn't exist (for backward compatibility)
      const chunkEmbedding = chunk.embedding || createSimpleEmbedding(chunk.content);
      
      return {
        content: chunk.content,
        similarity: cosineSimilarity(queryEmbedding, chunkEmbedding)
      };
    });
    
    // Sort by similarity (highest first) and return top results
    similarities.sort((a: any, b: any) => b.similarity - a.similarity);
    
    const results = similarities.slice(0, limit).map((item: any) => item.content);
    console.log("Returning", results.length, "similar documents");
    
    return results;
  } catch (error) {
    console.error("Error in querySimilarDocs:", error);
    throw new Error(`Failed to query vector store: ${(error as Error).message}`);
  }
}

/**
 * Call the Groq API with a given prompt
 */
async function callGroqAPI(prompt: string): Promise<string> {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          { 
            role: "system", 
            content: `You are LexiBot, a professional Pakistani legal AI assistant with extensive knowledge of Pakistani law, Islamic jurisprudence, and common law principles applicable in Pakistan. You specialize in making complex legal concepts accessible to layman users.

PAKISTANI LEGAL EXPERTISE:
- Constitution of Pakistan 1973 and all amendments
- Pakistan Penal Code (PPC) 1860
- Code of Civil Procedure (CPC) 1908
- Code of Criminal Procedure (CrPC) 1898
- Contract Act 1872 as applicable in Pakistan
- Companies Act 2017
- Family Laws Ordinance 1961
- Muslim Personal Law (Shariat) Application Act 1962
- Provincial laws and local ordinances
- Supreme Court and High Court precedents

COMMUNICATION STYLE FOR LAYMEN:
- Use simple Urdu/English terminology with legal terms explained
- Provide examples from Pakistani context
- Explain step-by-step procedures for legal matters
- Include relevant government departments/authorities
- Mention applicable fees, timeframes, and required documents
- Reference specific sections of Pakistani laws when relevant

PRACTICAL GUIDANCE:
- Suggest which court/forum has jurisdiction
- Explain the difference between civil and criminal matters
- Provide templates for common legal documents
- Explain rights and obligations under Pakistani law
- Include contact information for relevant authorities when helpful
- Warn about limitation periods and time-sensitive matters

RESPONSE FORMAT:
- Start with a simple summary in layman terms
- Use headings like "آپ کے حقوق" (Your Rights), "قانونی طریقہ کار" (Legal Procedure)
- Include both English and Urdu terms for key concepts
- Provide practical next steps with government department names
- Use bullet points and clear structure

LIMITATIONS:
- Always clarify this is general legal information, not specific legal advice
- Recommend consulting a qualified Pakistani lawyer for complex matters
- Include standard disclaimer about consulting legal professionals
- Base responses on provided documents and general Pakistani law knowledge

Remember: You serve Pakistani citizens who may not be familiar with legal jargon. Make the law accessible while maintaining accuracy.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent legal analysis
        max_tokens: 2000, // Increased for more detailed responses
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && 
        response.data.choices && 
        response.data.choices[0] && 
        response.data.choices[0].message &&
        response.data.choices[0].message.content) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error("Unexpected response format from Groq API");
    }
  } catch (error: any) {
    console.error("Error calling Groq API:", error.message);
    if (error.response) {
      console.error("Groq API response error:", error.response.data);
      console.error("Status:", error.response.status);
    }
    throw error;
  }
}

/**
 * Ask a question about a document using RAG
 */
export async function askQuestion(collectionId: string, question: string, language: string = "english"): Promise<string> {
  try {
    console.log("askQuestion called with:", { collectionId, question, language });
    
    const docs = await querySimilarDocs(collectionId, question, 3);
    console.log("Retrieved docs:", docs.length, "documents");
    
    const contextText = docs.join('\n\n');
    console.log("Context text length:", contextText.length);
    
    const isUrdu = language === "urdu";
    
    const prompt = `
PAKISTANI LEGAL DOCUMENT ANALYSIS REQUEST

DOCUMENT CONTEXT:
${contextText}

CLIENT QUESTION: ${question}
RESPONSE LANGUAGE: ${language}

ANALYSIS INSTRUCTIONS:
As a Pakistani legal assistant, provide analysis for a layman user in ${isUrdu ? 'Urdu with English terms in brackets' : 'English with key Urdu terms in brackets'}:

${isUrdu ? `
1. خلاصہ (SUMMARY): آسان الفاظ میں وضاحت
2. آپ کے حقوق (YOUR RIGHTS): یہ دستاویز آپ کو کیا حقوق دیتی ہے؟
3. قانونی معنی (LEGAL MEANING): پاکستانی قانون کے تحت اس کا کیا مطلب ہے؟
4. متعلقہ قوانین (RELEVANT LAWS): کون سے پاکستانی قوانین لاگو ہوتے ہیں؟
5. خطرات اور احتیاط (RISKS & PRECAUTIONS): کن باتوں کا خیال رکھنا ضروری ہے؟
6. اگلے قدم (NEXT STEPS): عملی اقدامات اور متعلقہ محکمے
7. ضروری دستاویزات (REQUIRED DOCUMENTS): کیا دستاویزات درکار ہوں گی؟
8. وقت کی حد (TIME LIMITS): کوئی ڈیڈ لائن یا وقت کی پابندی؟
` : `
1. SUMMARY (خلاصہ): Simple explanation of the document
2. YOUR RIGHTS (آپ کے حقوق): What rights does this document give/protect?
3. LEGAL MEANING (قانونی معنی): What does this mean under Pakistani law?
4. RELEVANT LAWS (متعلقہ قوانین): Which Pakistani laws, acts, or sections apply?
5. RISKS & PRECAUTIONS (خطرات اور احتیاط): What to be careful about?
6. NEXT STEPS (اگلے قدم): Practical steps with relevant government departments
7. REQUIRED DOCUMENTS (ضروری دستاویزات): What documents might be needed?
8. TIME LIMITS (وقت کی حد): Any deadlines or limitation periods?
`}

PAKISTANI CONTEXT:
- Reference specific Pakistani laws (PPC, CPC, CrPC, Constitution, etc.)
- Mention relevant courts (District, Session, High Court, Supreme Court)
- Include government departments (Registrar, Tehsildar, SHO, etc.)
- Provide fee estimates where applicable
- Use ${isUrdu ? 'اردو الفاظ انگریزی اصطلاحات کے ساتھ' : 'simple Urdu terms alongside English'}

FORMAT REQUIREMENTS:
- Use headings in ${isUrdu ? 'اردو' : 'English'} with translation in brackets
- Quote specific document clauses with "..." 
- Explain legal jargon in simple terms
- Include practical examples from Pakistani context
- Use bullet points for clarity

CONSTRAINTS:
- Base analysis ONLY on the provided document
- If document lacks info, specify what additional documents are needed
- Always include disclaimer about consulting a Pakistani lawyer

${isUrdu ? 
`قانونی ڈسکلیمر: یہ تجزیہ صرف فراہم کردہ دستاویز پر مبنی ہے اور یہ صرف معلوماتی مقاصد کے لیے ہے۔ یہ قانونی مشورہ نہیں ہے۔ مخصوص قانونی معاملات کے لیے کسی تجربہ کار پاکستانی وکیل سے رابطہ کریں۔` :
`LEGAL DISCLAIMER: This analysis is based only on the provided document and is for informational purposes only. This is not legal advice. For specific legal matters, please consult an experienced Pakistani lawyer.`}

RESPONSE:`;
    
    console.log("Calling Groq API...");
    const response = await callGroqAPI(prompt);
    console.log("Groq API response length:", response.length);
    
    return response;
  } catch (error) {
    console.error("Error in askQuestion:", error);
    console.error("Error stack:", (error as Error).stack);
    return `I'm sorry, I encountered an error while processing your question. Error details: ${(error as Error).message}`;
  }
}

/**
 * Debug function to check cache status
 */
export function getCacheStatus() {
  return {
    cacheSize: documentCache.size,
    cacheKeys: Array.from(documentCache.keys()),
    environment: process.env.NODE_ENV,
    hasGroqKey: !!process.env.GROQ_API_KEY
  };
}
