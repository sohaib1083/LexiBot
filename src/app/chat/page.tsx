"use client";
import { useState, useEffect } from "react";
import { MessageCircle, Plus, Send, FileText, Settings, Trash2 } from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  messages: Array<{ role: string; content: string }>;
  createdAt: Date;
  vectorStoreId: string;
}

export default function ChatPage() {
  const [currentMessages, setCurrentMessages] = useState([
    { role: "system", content: "Ask any question about your uploaded document." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vectorStoreId, setVectorStoreId] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-populate vector store ID from localStorage on component mount
  useEffect(() => {
    const savedVectorStoreId = localStorage.getItem('latestVectorStoreId');
    if (savedVectorStoreId) {
      setVectorStoreId(savedVectorStoreId);
    }
    
    // Load chat sessions from localStorage
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setChatSessions(sessions);
    }
  }, []);

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  // Create a new chat session
  const createNewChat = () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Chat",
      messages: [{ role: "system", content: "Ask any question about your uploaded document." }],
      createdAt: new Date(),
      vectorStoreId: vectorStoreId
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setCurrentMessages(newSession.messages);
  };

  // Switch to an existing chat session
  const switchToSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setCurrentMessages(session.messages);
      setVectorStoreId(session.vectorStoreId);
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
      setCurrentMessages([{ role: "system", content: "Ask any question about your uploaded document." }]);
    }
  };

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (!vectorStoreId) {
      alert("Please enter a Vector Store ID first or upload a document");
      return;
    }

    // If no current session, create one
    if (!currentSessionId) {
      createNewChat();
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
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: input,
          vectorStoreId: vectorStoreId,
        }),
      });

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
            <button
              onClick={createNewChat}
              className="w-full mt-3 flex items-center justify-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
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
                      <MessageCircle className="w-4 h-4 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{session.title}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(session.createdAt).toLocaleDateString()}
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
                <h1 className="text-xl font-bold">LexiBot Q&A</h1>
                <p className="text-sm text-slate-400">
                  Vector Store ID: {vectorStoreId || "Not set"} 
                  {vectorStoreId && <span className="text-green-400 ml-2">(Connected)</span>}
                </p>
              </div>
            </div>
            
            {/* Vector Store ID Input - Compact Version */}
            <div className="hidden lg:flex items-center space-x-2">
              <input
                className="w-64 px-3 py-2 text-sm bg-slate-700 text-white border border-slate-600 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={vectorStoreId}
                onChange={e => setVectorStoreId(e.target.value)}
                placeholder="Enter Vector Store ID..."
              />
            </div>
          </div>
          
          {/* Mobile Vector Store ID Input */}
          <div className="lg:hidden mt-3">
            <input
              className="w-full px-3 py-2 text-sm bg-slate-700 text-white border border-slate-600 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={vectorStoreId}
              onChange={e => setVectorStoreId(e.target.value)}
              placeholder="Enter Vector Store ID..."
            />
          </div>
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
              placeholder="Ask anything about your document..."
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
