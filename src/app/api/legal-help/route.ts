import { NextRequest, NextResponse } from "next/server";
import { pakistaniLegalKnowledge, getRelevantLaw } from "@/lib/pakistani-law-kb";

export async function POST(request: NextRequest) {
  try {
    const { question, category, language = "english" } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Get relevant Pakistani law context based on category
    const relevantLaw = category ? getRelevantLaw(category, question) : null;
    
    const prompt = `
PAKISTANI GENERAL LEGAL ASSISTANCE REQUEST

USER QUESTION: ${question}
CATEGORY: ${category || "General"}
LANGUAGE PREFERENCE: ${language}

CONTEXT - PAKISTANI LEGAL SYSTEM:
You are helping a Pakistani citizen who needs legal guidance. Use the following Pakistani legal framework:

CONSTITUTION OF PAKISTAN 1973:
- Fundamental Rights (Articles 8-28)
- Principles of Policy (Articles 29-40)
- Federal and Provincial jurisdictions

MAJOR LAWS:
- Pakistan Penal Code (PPC) 1860
- Code of Civil Procedure (CPC) 1908  
- Code of Criminal Procedure (CrPC) 1898
- Contract Act 1872
- Registration Act 1908
- Companies Act 2017
- Muslim Family Laws Ordinance 1961

COURT SYSTEM:
- Supreme Court of Pakistan (Islamabad)
- High Courts (Lahore, Karachi, Peshawar, Quetta, Islamabad)
- District & Sessions Courts
- Civil Courts, Magistrate Courts

RESPONSE REQUIREMENTS FOR LAYMAN USER:

1. سادہ جواب (SIMPLE ANSWER):
   - Explain in simple terms both in English and key Urdu terms
   - Avoid complex legal jargon

2. متعلقہ قانون (APPLICABLE LAW):
   - Which Pakistani law covers this issue
   - Specific sections if applicable
   - Court that has jurisdiction

3. عملی قدم (PRACTICAL STEPS):
   - Step-by-step procedure
   - Which government office to visit
   - Required documents with Urdu names
   - Approximate fees and timeframes

4. احتیاط (PRECAUTIONS):
   - What to be careful about
   - Common mistakes to avoid
   - Time limitations (حد وقت)

5. رابطہ کی معلومات (CONTACT INFORMATION):
   - Relevant government departments
   - Helpline numbers
   - Address/location information

6. ضروری دستاویزات (REQUIRED DOCUMENTS):
   - List with both English and Urdu names
   - Where to get them
   - Fees involved

FORMAT:
- Use simple language suitable for common Pakistani citizens
- Include both English and Urdu terms for key concepts
- Provide specific Pakistani examples and references
- Use bullet points for clarity

IMPORTANT LIMITATIONS:
- This is general legal information, not specific legal advice
- For complex matters, recommend consulting a qualified Pakistani lawyer
- Include standard disclaimer in both English and Urdu

LEGAL DISCLAIMER: یہ معلومات صرف عمومی رہنمائی کے لیے ہے اور یہ مخصوص قانونی مشورہ نہیں ہے۔ اپنے مخصوص معاملے کے لیے کسی تجربہ کار پاکستانی وکیل سے ضرور رابطہ کریں۔

RESPONSE:`;

    console.log("General legal assistance request:", { question, category });
    
    const response = await callGroqAPI(prompt);
    
    return NextResponse.json({ 
      answer: response,
      category: category || "general",
      language,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Error in general legal assistance:", error);
    return NextResponse.json(
      { error: "Failed to process your legal question", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Export the callGroqAPI function for other modules to use
async function callGroqAPI(prompt: string): Promise<string> {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `You are LexiBot, a Pakistani legal AI assistant specializing in Pakistani law and helping layman users understand complex legal matters in simple language.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      })
    });

    const data = await response.json();
    
    if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content;
    } else {
      throw new Error("Unexpected response format from Groq API");
    }
  } catch (error: any) {
    console.error("Error calling Groq API:", error.message);
    throw error;
  }
}
