'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Move metadata to a separate file since we're using client component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => setIsPageTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <title>LexiBot - Your AI Legal Assistant</title>
        <meta name="description" content="Upload legal documents and get instant AI-powered legal analysis - FREE Trial available!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-slate-900 text-white min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className={`flex-1 flex flex-col transition-all duration-500 ease-out ${
          isPageTransitioning ? 'opacity-90 translate-y-2' : 'opacity-100 translate-y-0'
        }`}>
          {children}
        </main>
        
        {/* Loading indicator for page transitions */}
        {isPageTransitioning && (
          <div className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse z-50"></div>
        )}
        
        {/* Background decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </body>
    </html>
  );
}
