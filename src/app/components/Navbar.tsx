"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, Upload, MessageCircle, Info, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: Scale },
    { href: "/upload", label: "Upload PDF", icon: Upload, badge: "New" },
    { href: "/chat", label: "Chat", icon: MessageCircle },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <nav
      className={`${scrolled ? 'glass-effect shadow-2xl' : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'} 
                  border-b border-slate-700 sticky top-0 z-50 transition-all duration-500 ease-out`}
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group transition-all duration-500 hover:scale-105 animate-slideInLeft">
            <div className="relative p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-lg group-hover:shadow-amber-400/50 transition-all duration-500 animate-glow floating">
              <Scale className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text animate-gradientShift">
                LexiBot
              </span>
              <span className="text-xs text-slate-400 -mt-1 hidden sm:block transition-colors duration-300 group-hover:text-amber-300">
                Your AI Legal Assistant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2 animate-fadeIn">
            {navItems.map(({ href, label, icon: Icon, badge }, index) => (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-500 group overflow-hidden ${
                  pathname === href
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-400/50 animate-glow"
                    : "text-slate-300 hover:bg-slate-700/80 hover:text-white hover:shadow-lg hover:shadow-slate-700/25 hover:scale-105"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-sm"></div>
                
                <Icon className={`w-4 h-4 transition-all duration-300 z-10 ${
                  pathname === href ? 'text-white' : 'text-slate-400 group-hover:text-amber-400 group-hover:scale-110'
                }`} />
                <span className="z-10">{label}</span>
                {badge && (
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-amber-500 text-white font-semibold animate-bounce z-10">
                    {badge}
                  </span>
                )}
                
                {/* Active indicator */}
                {pathname === href && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full animate-scaleIn"></div>
                )}
                
                {/* Hover ripple effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/30 to-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-0 group-hover:scale-100"></div>
              </Link>
            ))}
            
            {/* User Profile Button */}
            <button className="ml-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 transition-all duration-300 hover:scale-110 group animate-slideInRight">
              <User className="w-5 h-5 text-slate-300 group-hover:text-amber-400 transition-colors duration-300" />
              <div className="absolute inset-0 rounded-full bg-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative p-2 rounded-lg text-slate-300 hover:bg-slate-700/80 hover:text-white transition-all duration-300 group animate-slideInRight"
          >
            <div className="relative w-6 h-6">
              <Menu className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
                isMobileMenuOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
              }`} />
              <X className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
                isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
              }`} />
            </div>
            <div className="absolute inset-0 rounded-lg bg-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-700 ease-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-2 py-4 border-t border-slate-700/50 glass-effect">
            {navItems.map(({ href, label, icon: Icon, badge }, index) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-500 group ${
                  pathname === href
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg animate-glow"
                    : "text-slate-300 hover:bg-slate-700/80 hover:text-white hover:scale-105"
                } animate-slideInLeft`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className={`w-5 h-5 transition-all duration-300 ${
                  pathname === href ? 'text-white' : 'text-slate-400 group-hover:text-amber-400'
                }`} />
                <span>{label}</span>
                {badge && (
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-amber-500 text-white font-semibold animate-pulse">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
            
            {/* Mobile User Profile */}
            <button className="mt-2 flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-all duration-300 self-start group animate-slideInLeft"
                    style={{ animationDelay: '0.4s' }}>
              <User className="w-5 h-5 text-slate-300 group-hover:text-amber-400 transition-colors duration-300" />
              <span className="text-slate-300 group-hover:text-white text-sm">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Background blur effect when scrolled */}
      {scrolled && (
        <div className="absolute inset-0 -z-10 backdrop-blur-xl bg-slate-900/30"></div>
      )}
    </nav>
  );
}
