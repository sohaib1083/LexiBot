"use client";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Shield, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [vectorStoreId, setVectorStoreId] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && vectorStoreId) {
      router.push('/chat');
    }
  }, [countdown, vectorStoreId, router]);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setMessage("");
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setMessage("✅ Document uploaded successfully!");
        setVectorStoreId(result.vectorStoreId);
        
        // Store the vector store ID in localStorage
        localStorage.setItem('latestVectorStoreId', result.vectorStoreId);
        
        // Start countdown
        setCountdown(3);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setMessage(`❌ Upload failed: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type === 'application/pdf') {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <main className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="absolute inset-0 aurora-bg"></div>
        <div className="absolute top-1/4 left-1/3 w-72 h-72 liquid-shape animate-liquidWave"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 liquid-shape animate-zoomInOut" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'animate-slideAndFade' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text animate-gradientShift mb-6">
            Upload Your Document
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Upload any legal PDF and get instant AI-powered insights. 
            <span className="text-amber-400 font-semibold"> Your files are secure and auto-deleted.</span>
          </p>
        </div>

        {/* Enhanced Security Features */}
        <div className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'animate-slideInLeft' : 'opacity-0 translate-x-10'
        }`}>
          <div className="card text-center group hover:scale-105 transition-all duration-500 tilt-card">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold text-green-400 mb-2">Encrypted</h3>
            <p className="text-sm text-slate-400">End-to-end encryption</p>
          </div>
          <div className="card text-center group hover:scale-105 transition-all duration-500 tilt-card">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold text-blue-400 mb-2">Auto-Delete</h3>
            <p className="text-sm text-slate-400">Files deleted after use</p>
          </div>
          <div className="card text-center group hover:scale-105 transition-all duration-500 tilt-card">
            <FileText className="w-8 h-8 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold text-amber-400 mb-2">PDF Only</h3>
            <p className="text-sm text-slate-400">Up to 30 pages</p>
          </div>
        </div>

        {/* Upload Area */}
        <div className={`transition-all duration-1000 delay-500 ${
          isVisible ? 'animate-scaleIn' : 'opacity-0 scale-95'
        }`}>
          <div 
            className={`relative card border-2 border-dashed transition-all duration-500 cursor-pointer group ${
              isDragOver 
                ? 'border-amber-400 bg-amber-400/10 scale-105' 
                : uploading 
                  ? 'border-blue-400 bg-blue-400/10' 
                  : 'border-slate-600 hover:border-amber-400/50 hover:bg-amber-400/5'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnter={(e) => e.preventDefault()}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className="relative z-10 py-16 text-center">
              {uploading ? (
                <div className="space-y-6">
                  <Loader2 className="w-16 h-16 text-amber-400 mx-auto animate-spin" />
                  <div className="space-y-3">
                    <p className="text-xl font-semibold text-amber-400">Processing Document...</p>
                    <div className="max-w-md mx-auto bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 rounded-full animate-pulse"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-400">{Math.round(uploadProgress)}% complete</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <Upload className={`w-16 h-16 mx-auto transition-all duration-500 ${
                      isDragOver ? 'text-amber-400 scale-110' : 'text-slate-400 group-hover:text-amber-400 group-hover:scale-110'
                    }`} />
                    {isDragOver && (
                      <div className="absolute inset-0 w-16 h-16 mx-auto bg-amber-400/30 rounded-full blur-xl animate-pulse"></div>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-xl font-semibold mb-2 group-hover:text-amber-400 transition-colors duration-300">
                      {isDragOver ? 'Drop your PDF here!' : 'Drag & drop your PDF'}
                    </p>
                    <p className="text-slate-400 mb-6">or click to browse files</p>
                  </div>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold text-lg shadow-lg hover:shadow-amber-400/50 transition-all duration-500 hover:scale-110 cursor-pointer group-hover:animate-glow"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    Choose PDF File
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mt-8 animate-slideInLeft">
            <div className={`card border-l-4 ${
              message.includes('✅') 
                ? 'border-green-400 bg-green-400/10' 
                : 'border-red-400 bg-red-400/10'
            }`}>
              <div className="flex items-start space-x-4">
                {message.includes('✅') ? (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <p className="font-semibold mb-2">{message}</p>
                  
                  {vectorStoreId && (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-400 font-mono bg-slate-800/50 p-2 rounded">
                        Vector Store ID: {vectorStoreId}
                      </p>
                      
                      {countdown > 0 ? (
                        <div className="flex items-center space-x-3 p-4 bg-blue-400/10 rounded-xl border border-blue-400/30">
                          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                          <p className="text-blue-400 font-semibold">
                            Redirecting to chat in {countdown} seconds...
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => router.push('/chat')}
                          className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                        >
                          Start Chatting
                          <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-700 ${
          isVisible ? 'animate-fadeIn' : 'opacity-0'
        }`}>
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 gradient-text">What happens next?</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <p>1. Your PDF is securely processed and analyzed</p>
              <p>2. We create a searchable knowledge base from your document</p>
              <p>3. You can then chat with our AI about any aspect of your document</p>
              <p>4. Your file is automatically deleted after your session</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}