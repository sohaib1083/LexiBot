"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Plus, Send, FileText, Settings, Trash2, BookOpen, Upload } from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  messages: Array<{ role: string; content: string }>;
  createdAt: Date;
  vectorStoreId?: string;
  mode: 'document' | 'general';
}

// Language detection function
const detectLanguage = (text: string): 'english' | 'urdu' => {
  const urduPattern = /[\u0600-\u06FF]/;
  return urduPattern.test(text) ? 'urdu' : 'english';
};

// Category-specific starter questions
const getCategoryStarter = (category: string, language: 'english' | 'urdu' = 'english') => {
  const starters = {
    english: {
      'family': "👨‍👩‍👧‍👦 **Family Law Questions**\n\nI can help you with:\n• Marriage and divorce procedures\n• Khula and divorce laws\n• Child custody (Hizanat)\n• Maintenance (Nafaqah)\n• Inheritance laws\n• Property rights of women\n\n**What specific family law issue would you like help with?**",
      'property': "🏠 **Property Law Assistance**\n\nI can help you with:\n• Property registration procedures\n• Mutation of land records\n• Property disputes\n• Rent laws\n• Property inheritance\n• Registry and stamp duty\n\n**What property-related question do you have?**",
      'criminal': "⚖️ **Criminal Law Guidance**\n\nI can help you with:\n• FIR registration process\n• Bail procedures\n• Criminal court procedures\n• Rights of accused\n• Victim compensation\n• Police complaints\n\n**How can I assist you with your criminal law matter?**",
      'business': "💼 **Business & Commercial Law**\n\nI can help you with:\n• Company registration\n• Business licenses\n• Contract disputes\n• Tax obligations\n• Employment laws\n• Intellectual property\n\n**What business law question do you have?**",
      'civil': "📋 **Civil Law Matters**\n\nI can help you with:\n• Civil court procedures\n• Contract disputes\n• Recovery suits\n• Injunctions\n• Civil appeals\n• Execution of decrees\n\n**What civil law issue would you like guidance on?**"
    },
    urdu: {
      'family': "👨‍👩‍👧‍👦 **خاندانی قانون کے سوالات**\n\nمیں آپ کی مدد کر سکتا ہوں:\n• شادی اور طلاق کے طریقہ کار\n• خُلع اور طلاق کے قوانین\n• بچوں کی کسٹڈی (حضانت)\n• نفقہ کے قوانین\n• وراثت کے قوانین\n• خواتین کے املاک کے حقوق\n\n**آپ کو خاندانی قانون کے کس مسئلے میں مدد چاہیے؟**",
      'property': "🏠 **املاک کے قانون میں مدد**\n\nمیں آپ کی مدد کر سکتا ہوں:\n• املاک کی رجسٹری کے طریقے\n• زمینی ریکارڈ کی تبدیلی (میوٹیشن)\n• املاک کے تنازعات\n• کرایہ کے قوانین\n• املاک کی وراثت\n• رجسٹری اور سٹیمپ ڈیوٹی\n\n**آپ کا املاک سے متعلق کیا سوال ہے؟**",
      'criminal': "⚖️ **فوجداری قانون کی رہنمائی**\n\nمیں آپ کی مدد کر سکتا ہوں:\n• ایف آئی آر درج کرانے کا طریقہ\n• ضمانت کے طریقے\n• فوجداری عدالت کے طریقہ کار\n• ملزم کے حقوق\n• متاثرین کا معاوضہ\n• پولیس شکایات\n\n**فوجداری قانون کے کس معاملے میں آپ کو مدد چاہیے؟**",
      'business': "💼 **کاروباری اور تجارتی قانون**\n\nمیں آپ کی مدد کر سکتا ہوں:\n• کمپنی کی رجسٹریشن\n• کاروباری لائسنس\n• معاہدوں کے تنازعات\n• ٹیکس کی ذمہ داریاں\n• ملازمت کے قوانین\n• دانشورانہ املاک\n\n**کاروباری قانون کا آپ کا کیا سوال ہے؟**",
      'civil': "📋 **دیوانی قانون کے معاملات**\n\nمیں آپ کی مدد کر سکتا ہوں:\n• دیوانی عدالت کے طریقہ کار\n• معاہدوں کے تنازعات\n• رقم کی وصولی کے مقدمات\n• حکم امتناعی (انجکشن)\n• دیوانی اپیل\n• فیصلوں کا نفاذ\n\n**دیوانی قانون کے کس مسئلے میں آپ کو رہنمائی چاہیے؟**"
    }
  };
  
  return (starters[language] as any)[category] || 
         (language === 'urdu' ? "آپ کا قانونی سوال کیا ہے؟" : "How can I help you with your legal question?");
};

function ChatPageContent() {
  const searchParams = useSearchParams();
  const [chatMode, setChatMode] = useState<'document' | 'general'>('general');
  const [currentMessages, setCurrentMessages] = useState([
    { role: "system", content: "Ask any Pakistani legal question or upload a document for analysis." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vectorStoreId, setVectorStoreId] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [detectedLanguage, setDetectedLanguage] = useState<'english' | 'urdu'>('english');

  // Initialize from URL parameters and localStorage
  useEffect(() => {
    // Check URL parameters first
    const mode = searchParams.get('mode');
    const urlVectorStoreId = searchParams.get('vectorStoreId');
    const category = searchParams.get('category');
    const language = searchParams.get('language') as 'english' | 'urdu' || 'english';
    
    // Set language preference
    setDetectedLanguage(language);
    
    if (mode === 'document' && urlVectorStoreId) {
      // Coming from document upload
      setChatMode('document');
      setVectorStoreId(urlVectorStoreId);
      setCurrentMessages([{ 
        role: "system", 
        content: language === 'urdu' 
          ? "دستاویز کامیابی سے اپ لوڈ ہو گئی! اپنی اپ لوڈ شدہ دستاویز کے بارے میں کوئی بھی سوال پوچھیں۔"
          : "Document uploaded successfully! Ask any question about your uploaded document." 
      }]);
    } else if (category) {
      // Coming from legal help category - FORCE general mode
      setChatMode('general');
      setVectorStoreId(''); // Clear any vector store ID
      const starterMessage = getCategoryStarter(category, language);
      setCurrentMessages([{ 
        role: "system", 
        content: starterMessage
      }]);
    } else {
      // Default behavior - check localStorage
      const savedVectorStoreId = localStorage.getItem('latestVectorStoreId');
      if (savedVectorStoreId) {
        setVectorStoreId(savedVectorStoreId);
        // Set to document mode if we have a vector store ID but no explicit mode
        setChatMode('document');
      } else {
        setChatMode('general');
      }
    }
    
    // Load chat sessions from localStorage
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setChatSessions(sessions);
    }
  }, [searchParams]);

  // Listen for new document uploads and auto-switch to document mode
  useEffect(() => {
    const handleStorageChange = () => {
      // Don't auto-switch if we're explicitly in a legal help category
      const category = searchParams.get('category');
      const mode = searchParams.get('mode');
      
      if (category) {
        // We're in legal help mode, don't override
        return;
      }
      
      const newVectorStoreId = localStorage.getItem('latestVectorStoreId');
      if (newVectorStoreId && newVectorStoreId !== vectorStoreId && !mode) {
        setVectorStoreId(newVectorStoreId);
        setChatMode('document');
        
        // Create a new document chat session automatically
        const newSessionId = Date.now().toString();
        const newSession: ChatSession = {
          id: newSessionId,
          title: "New Document Analysis",
          messages: [{ 
            role: "system", 
            content: "Document uploaded successfully! Ask any question about your uploaded document." 
          }],
          createdAt: new Date(),
          vectorStoreId: newVectorStoreId,
          mode: 'document'
        };
        
        setChatSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSessionId);
        setCurrentMessages(newSession.messages);
      }
    };

    // Listen for storage changes (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for changes (in case upload happens in same tab)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [vectorStoreId, searchParams]);

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  // Create a new chat session
  const createNewChat = (mode: 'document' | 'general' = chatMode) => {
    const newSessionId = Date.now().toString();
    const systemMessage = mode === 'document' 
      ? "Ask any question about your uploaded document."
      : "Ask any Pakistani legal question. I can help with family law, property, business, criminal matters, and more.";
      
    const newSession: ChatSession = {
      id: newSessionId,
      title: `New ${mode === 'document' ? 'Document' : 'Legal'} Chat`,
      messages: [{ role: "system", content: systemMessage }],
      createdAt: new Date(),
      vectorStoreId: mode === 'document' ? vectorStoreId : undefined,
      mode: mode
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setCurrentMessages(newSession.messages);
    setChatMode(mode);
  };

  // Switch to an existing chat session
  const switchToSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setCurrentMessages(session.messages);
      setChatMode(session.mode);
      if (session.vectorStoreId) {
        setVectorStoreId(session.vectorStoreId);
      }
    }
  };

  // Update current session title based on first user message
  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    setChatSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? "..." : "") }
        : session
    ));
  };

  // Save current session messages
  const saveCurrentSession = (messages: Array<{ role: string; content: string }>) => {
    if (currentSessionId) {
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages }
          : session
      ));
    }
  };

  // Delete a chat session
  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    
    // If deleting current session, reset to default
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setCurrentMessages([{ role: "system", content: "Ask any Pakistani legal question or upload a document for analysis." }]);
    }
  };

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Detect language automatically from user input
    const currentLanguage = detectLanguage(input);
    setDetectedLanguage(currentLanguage);
    
    // Check if document mode requires vector store ID
    if (chatMode === 'document' && !vectorStoreId) {
      const alertMsg = currentLanguage === 'urdu' 
        ? "براہ کرم پہلے Vector Store ID درج کریں یا دستاویز اپ لوڈ کریں"
        : "Please enter a Vector Store ID first or upload a document";
      alert(alertMsg);
      return;
    }

    // If no current session, create one
    if (!currentSessionId) {
      createNewChat(chatMode);
    }

    const userMessage = { role: "user", content: input };
    const newMessages = [...currentMessages, userMessage];
    setCurrentMessages(newMessages);
    
    // Update session title with first user message
    if (currentSessionId && currentMessages.length === 1) {
      updateSessionTitle(currentSessionId, input);
    }
    
    setInput("");
    setIsLoading(true);

    try {
      let response;
      
      if (chatMode === 'document') {
        // Document-based question
        response = await fetch("/api/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: input,
            vectorStoreId: vectorStoreId,
            language: currentLanguage
          }),
        });
      } else {
        // General legal question
        response = await fetch("/api/legal-help", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: input,
            category: "general",
            language: currentLanguage
          }),
        });
      }

      const data = await response.json();
      
      if (response.ok) {
        const aiMessage = { role: "assistant", content: data.answer };
        const finalMessages = [...newMessages, aiMessage];
        setCurrentMessages(finalMessages);
        saveCurrentSession(finalMessages);
      } else {
        const errorMessage = { role: "assistant", content: `Error: ${data.error}` };
        const finalMessages = [...newMessages, errorMessage];
        setCurrentMessages(finalMessages);
        saveCurrentSession(finalMessages);
      }
    } catch (error) {
      const errorMessage = { role: "assistant", content: "Sorry, I encountered an error while processing your question." };
      const finalMessages = [...newMessages, errorMessage];
      setCurrentMessages(finalMessages);
      saveCurrentSession(finalMessages);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-900 text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="font-semibold">LexiBot Chats</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
          
          {sidebarOpen && (
            <div className="space-y-3 mt-3">
              {/* Mode Selection */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setChatMode('general')}
                  className={`flex items-center justify-center space-x-1 p-2 rounded-lg text-xs transition-colors ${
                    chatMode === 'general' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Legal Help</span>
                </button>
                <button
                  onClick={() => setChatMode('document')}
                  className={`flex items-center justify-center space-x-1 p-2 rounded-lg text-xs transition-colors ${
                    chatMode === 'document' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Document</span>
                </button>
              </div>
              
              {/* New Chat Button */}
              <button
                onClick={() => createNewChat()}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New {chatMode === 'document' ? 'Document' : 'Legal'} Chat</span>
              </button>
            </div>
          )}
        </div>

        {/* Chat Sessions List */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto p-2">
            {chatSessions.length === 0 ? (
              <div className="text-center text-slate-400 mt-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chat sessions yet</p>
                <p className="text-xs">Start a new chat to begin</p>
              </div>
            ) : (
              chatSessions.map((session) => (
                <div key={session.id} className="relative group">
                  <button
                    onClick={() => switchToSession(session.id)}
                    className={`w-full text-left p-3 rounded-lg mb-2 hover:bg-slate-700 transition-colors ${
                      currentSessionId === session.id ? 'bg-slate-700 border-l-4 border-amber-400' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {session.mode === 'document' ? (
                        <Upload className="w-4 h-4 text-green-400" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-blue-400" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{session.title}</p>
                        <p className="text-xs text-slate-400">
                          {session.mode === 'document' ? 'Document Chat' : 'Legal Help'} • {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => deleteSession(session.id, e)}
                    className="absolute right-2 top-3 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 rounded transition-all"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold">
                  {chatMode === 'document' ? 'Document Q&A' : 'Pakistani Legal Help'}
                </h1>
                <p className="text-sm text-slate-400">
                  {chatMode === 'document' 
                    ? `Vector Store ID: ${vectorStoreId || "Not set"} ${vectorStoreId ? "(Connected)" : ""}`
                    : "Ask any Pakistani legal question"
                  }
                  {detectedLanguage && (
                    <span className="ml-3 px-2 py-1 bg-amber-600/20 text-amber-400 rounded-md text-xs">
                      {detectedLanguage === 'urdu' ? '🇵🇰 اردو' : '🇺🇸 English'}
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Vector Store ID Input - Only for Document Mode */}
            {chatMode === 'document' && (
              <div className="hidden lg:flex items-center space-x-2">
                <input
                  className="w-64 px-3 py-2 text-sm bg-slate-700 text-white border border-slate-600 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={vectorStoreId}
                  onChange={e => setVectorStoreId(e.target.value)}
                  placeholder="Enter Vector Store ID..."
                />
              </div>
            )}
          </div>
          
          {/* Mobile Vector Store ID Input - Only for Document Mode */}
          {chatMode === 'document' && (
            <div className="lg:hidden mt-3">
              <input
                className="w-full px-3 py-2 text-sm bg-slate-700 text-white border border-slate-600 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={vectorStoreId}
                onChange={e => setVectorStoreId(e.target.value)}
                placeholder="Enter Vector Store ID..."
              />
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentMessages.map((msg: any, idx: number) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-3xl p-4 rounded-lg ${
                msg.role === "user" 
                  ? "bg-amber-600 text-white" 
                  : msg.role === "system"
                  ? "bg-slate-700 text-slate-300 border-l-4 border-amber-400"
                  : "bg-slate-800 text-slate-200 border border-slate-700"
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-200 border border-slate-700 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  <span className="ml-2">LexiBot is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-slate-800 border-t border-slate-700 p-4">
          <form onSubmit={handleSend} className="flex space-x-3">
            <input
              className="flex-1 px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={chatMode === 'document' 
                ? (detectedLanguage === 'urdu' ? "اپنی دستاویز کے بارے میں کچھ بھی پوچھیں..." : "Ask anything about your document...") 
                : (detectedLanguage === 'urdu' ? "کوئی بھی پاکستانی قانونی سوال پوچھیں..." : "Ask any Pakistani legal question...")
              }
              disabled={isLoading}
            />
            <button 
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold rounded-lg shadow hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2" 
              type="submit"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? "..." : "Send"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function ChatPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-300">Loading LexiBot...</p>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function ChatPage() {
  return (
    <Suspense fallback={<ChatPageLoading />}>
      <ChatPageContent />
    </Suspense>
  );
}
