'use client';

import Link from "next/link";
import { Upload, MessageCircle, ShieldCheck, Star, Lock, Zap, CheckCircle, Users, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Testimonial carousel
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    { name: "Sarah M.", role: "Small Business Owner", text: "LexiBot helped me understand my contract terms in minutes. Incredible!" },
    { name: "Mike R.", role: "Freelancer", text: "Perfect for quick legal questions. Saved me hundreds in consultation fees." },
    { name: "Lisa K.", role: "Real Estate Agent", text: "The AI explanations are clear and thorough. Highly recommend!" }
  ];

  const stats = [
    { number: "10,000+", label: "Documents Processed", icon: Upload },
    { number: "99.8%", label: "Accuracy Rate", icon: CheckCircle },
    { number: "5 min", label: "Average Response", icon: Zap },
    { number: "50,000+", label: "Happy Users", icon: Users }
  ];

  return (
    <main className="min-h-screen text-white overflow-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        {/* Aurora Background */}
        <div className="absolute inset-0 aurora-bg"></div>
        
        {/* Floating Particles */}
        <div className="particle-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle animate-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Enhanced Gradient Orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent)] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 liquid-shape animate-liquidWave"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 liquid-shape animate-liquidWave" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 liquid-shape animate-zoomInOut" style={{animationDelay: '1s'}}></div>
        
        {/* Cyber Grid */}
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center py-20 px-4 relative">
          {/* Enhanced Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/20 rounded-full blur-xl animate-float floating"></div>
          <div className="absolute bottom-40 right-10 w-16 h-16 bg-orange-500/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-32 right-20 w-12 h-12 bg-blue-400/20 rounded-full blur-xl animate-floatReverse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '1.5s'}}></div>
          
          <div className={`max-w-4xl text-center space-y-8 transition-all duration-1000 ${
            isVisible ? 'animate-slideAndFade' : 'opacity-0 translate-y-10'
          }`}>
            {/* Enhanced Badge */}
            <div className="flex justify-center mb-6 animate-elasticIn">
              <span className="inline-flex items-center px-6 py-2 rounded-full glass-effect border border-amber-400/30 text-amber-400 text-sm font-semibold shadow-lg animate-glow neon-border">
                <Star className="w-4 h-4 mr-2 animate-sparkle" />
                FREE Trial • No Subscription Required
              </span>
            </div>

            {/* Enhanced Main Heading with Glitch Effect */}
            <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight animate-slideInRight">
              <span className="block gradient-text animate-gradientShift animate-neonGlow mb-4" data-text="Your AI">Your AI</span>
              <span className="block gradient-text animate-gradientShift animate-neonGlow" style={{animationDelay: '0.5s'}} data-text="Legal Assistant">Legal Assistant</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-fadeIn" style={{animationDelay: '0.8s'}}>
              Upload any legal document and get instant, AI-powered insights. 
              <span className="text-amber-400 font-semibold"> No lawyers. No waiting. Just answers.</span>
            </p>

            {/* Enhanced CTA Button */}
            <div className="animate-elasticIn" style={{animationDelay: '1.2s'}}>
              <Link
                href="/upload"
                className="group inline-flex items-center px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold text-xl shadow-2xl hover:shadow-amber-400/50 transition-all duration-500 hover:scale-110 animate-glow tilt-card"
              >
                Get Started FREE
                <ArrowRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-2 animate-wiggle" />
              </Link>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex justify-center gap-8 mt-8 flex-wrap animate-slideAndFade" style={{animationDelay: '1.5s'}}>
              <div className="flex items-center gap-2 group hover-lift">
                <Lock className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
                <span className="text-sm text-slate-400 group-hover:text-green-400 transition-colors duration-300">Private & Secure</span>
              </div>
              <div className="flex items-center gap-2 group hover-lift">
                <Star className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform duration-300 animate-sparkle" />
                <span className="text-sm text-slate-400 group-hover:text-amber-400 transition-colors duration-300">Trusted by 50K+ Users</span>
              </div>
              <div className="flex items-center gap-2 group hover-lift">
                <Zap className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300 animate-float" />
                <span className="text-sm text-slate-400 group-hover:text-blue-400 transition-colors duration-300">Instant Results</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-20 px-4 border-t border-slate-700/50 aurora-bg">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group animate-slideInLeft tilt-card" style={{animationDelay: `${index * 0.2}s`}}>
                    <div className="card hover:scale-105 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-amber-400/20 neon-border">
                      <Icon className="w-8 h-8 text-amber-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 animate-zoomInOut" />
                      <div className="text-3xl font-bold gradient-text mb-2 animate-neonGlow">{stat.number}</div>
                      <div className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced How It Works */}
        <section className="py-20 px-4 cyber-grid">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center gradient-text mb-16 animate-fadeIn animate-neonGlow">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: Upload, title: "Upload Document", desc: "Choose your legal PDF (up to 30 pages)", step: "1" },
                { icon: Zap, title: "FREE Trial", desc: "No payment required. Start analyzing immediately", step: "2" },
                { icon: MessageCircle, title: "Get Answers", desc: "Chat with AI and get instant insights", step: "3" }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="relative text-center group animate-slideInLeft tilt-card" style={{animationDelay: `${index * 0.3}s`}}>
                    <div className="card hover:scale-105 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-amber-400/20 neon-border">
                      {/* Enhanced Step Number */}
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm animate-bounce animate-glow">
                        {item.step}
                      </div>
                      
                      <Icon className="w-16 h-16 text-amber-400 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-zoomInOut" />
                      <h3 className="text-xl font-bold mb-4 group-hover:text-amber-400 transition-colors duration-300 gradient-text">{item.title}</h3>
                      <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Features Grid */}
        <section className="py-20 px-4 aurora-bg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center gradient-text mb-16 animate-fadeIn animate-neonGlow">Why Choose LexiBot?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: ShieldCheck, title: "Private & Secure", desc: "Files are encrypted and auto-deleted after use. Your privacy is our priority.", color: "green" },
                { icon: Zap, title: "FREE Trial", desc: "No cost, no subscriptions, no hidden fees. Start analyzing documents immediately.", color: "amber" },
                { icon: Zap, title: "Lightning Fast", desc: "Get instant AI-powered legal insights in minutes, not hours or days.", color: "blue" },
                { icon: Users, title: "User Friendly", desc: "Simple interface designed for everyone. No legal expertise required.", color: "purple" }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="group animate-slideInRight tilt-card" style={{animationDelay: `${index * 0.2}s`}}>
                    <div className="card hover:scale-105 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-amber-400/20 neon-border">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl bg-${feature.color}-400/20 group-hover:scale-110 transition-transform duration-300 animate-float`}>
                          <Icon className={`w-6 h-6 text-${feature.color}-400 animate-sparkle`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors duration-300 gradient-text">{feature.title}</h3>
                          <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold gradient-text mb-16 animate-fadeIn">What Users Say</h2>
            <div className="relative h-40">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    index === currentTestimonial 
                      ? 'opacity-100 transform translate-y-0' 
                      : 'opacity-0 transform translate-y-8'
                  }`}
                >
                  <div className="card max-w-2xl mx-auto">
                    <p className="text-lg text-slate-300 italic mb-6">"{testimonial.text}"</p>
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-amber-400">{testimonial.name}</p>
                        <p className="text-sm text-slate-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Final CTA */}
        <section className="py-20 px-4 aurora-bg relative overflow-hidden">
          {/* Additional background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 w-96 h-96 liquid-shape animate-liquidWave" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold gradient-text mb-6 animate-fadeIn animate-neonGlow">Ready to Get Started?</h2>
            <p className="text-xl text-slate-300 mb-8 animate-fadeIn" style={{animationDelay: '0.3s'}}>
              Upload your document and get instant legal insights - <span className="gradient-text font-bold">FREE Trial Available!</span>
            </p>
            <Link
              href="/upload"
              className="group inline-flex items-center px-12 py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold text-xl shadow-2xl hover:shadow-amber-400/50 transition-all duration-500 hover:scale-110 animate-glow animate-elasticIn tilt-card neon-border"
              style={{animationDelay: '0.6s'}}
            >
              Start Your Legal Analysis
              <ArrowRight className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-2 animate-wiggle" />
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 px-4 border-t border-slate-700/50">
          <div className="max-w-4xl mx-auto">
            <div className="legal-warning animate-fadeIn">
              <p className="text-center text-sm">
                <strong>Legal Disclaimer:</strong> LexiBot is an AI assistant and{" "}
                <span className="font-bold text-amber-400">not a substitute for professional legal advice</span>. 
                No attorney-client relationship is formed. Documents are encrypted and automatically deleted after use.
                Always consult with a qualified attorney for legal matters.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
