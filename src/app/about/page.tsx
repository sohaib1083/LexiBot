'use client';

import { Scale, Shield, Zap, Users, Clock, CheckCircle, AlertTriangle, Brain, FileText, Lock } from "lucide-react";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Technology",
      description: "Powered by state-of-the-art language models specifically fine-tuned for legal document analysis.",
      color: "blue"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "End-to-end encryption with automatic file deletion. Your documents never leave our secure servers.",
      color: "green"
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get comprehensive legal insights in minutes, not hours. No waiting for appointments or callbacks.",
      color: "amber"
    },
    {
      icon: Zap,
      title: "FREE Trial Available",
      description: "Get started immediately with no upfront costs. Full access to legal document analysis.",
      color: "orange"
    }
  ];

  const howItWorks = [
    { step: "1", title: "Upload Document", desc: "Securely upload your PDF (up to 30 pages)" },
    { step: "2", title: "AI Processing", desc: "Our AI analyzes and understands your document" },
    { step: "3", title: "Interactive Chat", desc: "Ask questions and get detailed legal insights" },
    { step: "4", title: "Secure Cleanup", desc: "Files are automatically deleted after your session" }
  ];

  const stats = [
    { number: "50,000+", label: "Documents Processed" },
    { number: "99.8%", label: "Accuracy Rate" },
    { number: "24/7", label: "Available" },
    { number: "FREE", label: "Trial Access" }
  ];

  return (
    <main className="min-h-screen text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 py-20 px-4">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-20">
          <div className={`transition-all duration-1000 ${
            isVisible ? 'animate-fadeIn' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg animate-glow floating">
                <Scale className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold gradient-text animate-gradientShift mb-6">
              About LexiBot
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              LexiBot is your AI-powered legal assistant, designed to make legal document analysis 
              accessible, affordable, and instant. We democratize legal insights for everyone.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slideInLeft" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="card hover:scale-105 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-amber-400/20">
                  <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center gradient-text mb-16 animate-fadeIn">
            Why Choose LexiBot?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="animate-slideInRight" style={{animationDelay: `${index * 0.2}s`}}>
                  <div className="card hover:scale-105 transition-all duration-500 group h-full">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-${feature.color}-400/20 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-8 h-8 text-${feature.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-amber-400 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center gradient-text mb-16 animate-fadeIn">
            How LexiBot Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center animate-slideInLeft" style={{animationDelay: `${index * 0.3}s`}}>
                <div className="card hover:scale-105 transition-all duration-500 group relative">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm animate-bounce">
                    {item.step}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-3 group-hover:text-amber-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="card animate-fadeIn">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold gradient-text">Our Mission</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                We believe that everyone deserves access to legal insights, regardless of their budget or location. 
                LexiBot breaks down barriers to legal understanding by providing instant, accurate, and affordable 
                document analysis powered by cutting-edge AI technology.
              </p>
              <div className="flex justify-center space-x-8 mt-8">
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Accessible</p>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Instant</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Reliable</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="card animate-slideInLeft border-l-4 border-green-400 bg-green-400/5">
            <div className="flex items-start space-x-4">
              <Shield className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-3">Your Security is Our Priority</h3>
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-green-400" />
                    <span>End-to-end encryption for all uploads</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-green-400" />
                    <span>Automatic file deletion after processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>No permanent storage of sensitive data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>GDPR compliant data handling</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="max-w-4xl mx-auto">
          <div className="legal-warning animate-fadeIn">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-amber-400 mb-3">Important Legal Disclaimer</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>LexiBot is an AI assistant and NOT a substitute for professional legal advice.</strong>
                  </p>
                  <p>
                    • No attorney-client relationship is formed through use of this service<br />
                    • Information provided is for educational purposes only<br />
                    • Always consult with a qualified attorney for legal matters<br />
                    • LexiBot cannot provide legal representation or binding legal opinions
                  </p>
                  <p className="font-semibold text-amber-300">
                    Use of LexiBot does not create any legal privileges or protections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
