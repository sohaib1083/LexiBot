"use client";

import { useState } from "react";
import Link from "next/link";

interface LegalCategory {
  id: string;
  title: string;
  urduTitle: string;
  description: string;
  commonQuestions: string[];
  urgency: 'low' | 'medium' | 'high';
}

const legalCategories: LegalCategory[] = [
  {
    id: "family",
    title: "Family Law",
    urduTitle: "خاندانی قانون",
    description: "Marriage, divorce, inheritance, child custody",
    commonQuestions: [
      "How do I file for divorce in Pakistan?",
      "What are my inheritance rights?",
      "How to register a marriage?",
      "Child custody laws in Pakistan"
    ],
    urgency: "medium"
  },
  {
    id: "property",
    title: "Property Law",
    urduTitle: "جائیداد کا قانون",
    description: "Buying, selling, rent disputes, property registration",
    commonQuestions: [
      "How to buy property legally in Pakistan?",
      "What documents are needed for property transfer?",
      "How to resolve rent disputes?",
      "Property registration process"
    ],
    urgency: "medium"
  },
  {
    id: "business",
    title: "Business Law",
    urduTitle: "کاروباری قانون",
    description: "Company registration, contracts, business disputes",
    commonQuestions: [
      "How to register a company in Pakistan?",
      "What are business tax obligations?",
      "How to draft a business contract?",
      "Employee rights in Pakistan"
    ],
    urgency: "low"
  },
  {
    id: "criminal",
    title: "Criminal Law",
    urduTitle: "فوجداری قانون",
    description: "FIR, bail, criminal cases, police matters",
    commonQuestions: [
      "How to file an FIR?",
      "What are my rights if arrested?",
      "How to get bail?",
      "When can police arrest someone?"
    ],
    urgency: "high"
  },
  {
    id: "civil",
    title: "Civil Law",
    urduTitle: "دیوانی قانون",
    description: "Contracts, disputes, civil court procedures",
    commonQuestions: [
      "How to file a civil case?",
      "What is the limitation period?",
      "How to recover money through court?",
      "Civil court fees in Pakistan"
    ],
    urgency: "medium"
  },
  {
    id: "labor",
    title: "Labor Law",
    urduTitle: "مزدور قانون",
    description: "Employee rights, workplace issues, labor disputes",
    commonQuestions: [
      "What are minimum wage laws?",
      "How to file labor complaint?",
      "Employee termination rights",
      "Workplace harassment laws"
    ],
    urgency: "medium"
  }
];

export default function LegalHelp() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Legal Help Center
            <span className="block text-2xl text-gray-600 mt-2">قانونی مدد مرکز</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get help with Pakistani legal matters in simple language. Choose your legal issue below or upload documents for analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {legalCategories.map((category) => (
            <div
              key={category.id}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 border-2 ${
                selectedCategory === category.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {category.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  category.urgency === 'high' ? 'bg-red-100 text-red-800' :
                  category.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {category.urgency === 'high' ? 'Urgent' : 
                   category.urgency === 'medium' ? 'Important' : 'General'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-2">{category.urduTitle}</p>
              <p className="text-gray-700 mb-4">{category.description}</p>
              
              {selectedCategory === category.id && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Common Questions:</h4>
                  <ul className="space-y-2">
                    {category.commonQuestions.map((question, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {question}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 space-y-2">
                    <Link 
                      href={`/chat?category=${category.id}&language=english`}
                      className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition-colors"
                    >
                      Ask Questions About {category.title}
                    </Link>
                    <Link 
                      href={`/chat?category=${category.id}&language=urdu`}
                      className="block w-full bg-amber-600 text-white py-2 px-4 rounded-md text-center hover:bg-amber-700 transition-colors"
                    >
                      {category.urduTitle} کے بارے میں سوال پوچھیں
                    </Link>
                    <Link 
                      href="/upload"
                      className="block w-full bg-green-600 text-white py-2 px-4 rounded-md text-center hover:bg-green-700 transition-colors"
                    >
                      Upload Related Documents
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Emergency Legal Situations
            <span className="block text-lg text-gray-600 mt-1">ہنگامی قانونی صورتحال</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <h3 className="font-semibold text-red-800 mb-2">🚨 Immediate Help Needed</h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Arrested or detained</li>
                <li>• Police harassment</li>
                <li>• Domestic violence</li>
                <li>• Property seizure</li>
              </ul>
              <div className="mt-3">
                <p className="text-xs text-red-600 font-medium">
                  Contact: Legal Aid Office: 051-111-112-113
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Time-Sensitive Matters</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Court hearing dates</li>
                <li>• Legal notice responses</li>
                <li>• Contract deadlines</li>
                <li>• Appeal time limits</li>
              </ul>
              <div className="mt-3">
                <p className="text-xs text-yellow-600 font-medium">
                  Get help within 24-48 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              📚 Document Analysis Service
            </h3>
            <p className="text-blue-700 mb-4">
              Upload your legal documents for AI-powered analysis in simple language
            </p>
            <Link 
              href="/upload"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Analyze My Documents
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
