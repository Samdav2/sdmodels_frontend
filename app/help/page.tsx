"use client";

import Link from "next/link";
import { useState } from "react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: "📚" },
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "buying", name: "Buying Models", icon: "🛒" },
    { id: "selling", name: "Selling Models", icon: "💰" },
    { id: "account", name: "Account", icon: "👤" },
    { id: "technical", name: "Technical", icon: "⚙️" },
  ];

  const faqs = [
    {
      category: "getting-started",
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button in the top right corner. You can register with email or use OAuth (Google, GitHub, Discord)."
    },
    {
      category: "buying",
      question: "How do I purchase a 3D model?",
      answer: "Browse the marketplace, click on a model, and click 'Add to Cart'. Then proceed to checkout and complete payment."
    },
    {
      category: "buying",
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards (Visa, Mastercard, Amex), PayPal, and cryptocurrency."
    },
    {
      category: "buying",
      question: "Can I get a refund?",
      answer: "Yes, within 14 days if the model is significantly different from its description or has critical defects."
    },
    {
      category: "selling",
      question: "How do I upload a model?",
      answer: "Go to Dashboard > Upload Model. Fill in details, upload your files (GLB/GLTF), and submit for review."
    },
    {
      category: "selling",
      question: "What is the platform fee?",
      answer: "SDModels charges 7.5% on all sales. You receive 92.5% of the sale price."
    },
    {
      category: "selling",
      question: "When do I get paid?",
      answer: "Payouts are processed weekly to your connected payment account (PayPal or bank transfer)."
    },
    {
      category: "account",
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email, and follow the reset link sent to you."
    },
    {
      category: "account",
      question: "Can I change my username?",
      answer: "Yes, go to Dashboard > Settings > Profile and update your username."
    },
    {
      category: "technical",
      question: "What file formats are supported?",
      answer: "We support GLB, GLTF, FBX, OBJ, and other common 3D formats. GLB/GLTF are recommended for best viewer performance."
    },
    {
      category: "technical",
      question: "What is the maximum file size?",
      answer: "Free users: 50MB per model. Pro users: 500MB. Enterprise: 2GB."
    },
  ];

  const filteredFaqs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const searchedFaqs = searchQuery
    ? filteredFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFaqs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white rounded-lg transition text-sm font-semibold"
            >
              📚 API Docs
            </Link>
            <Link
              href="/support"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-semibold"
            >
              💬 Contact Support
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">
            ❓ Help Center
          </h1>
          <p className="text-gray-400 text-lg">
            Find answers to common questions
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full px-6 py-4 bg-slate-900/50 border border-orange-500/20 rounded-xl text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                selectedCategory === category.id
                  ? "bg-orange-500 text-white"
                  : "bg-slate-900/50 border border-slate-700 text-gray-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto space-y-4">
          {searchedFaqs.length > 0 ? (
            searchedFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/50 transition"
              >
                <h3 className="text-white font-bold text-lg mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤔</div>
              <p className="text-gray-400 text-lg">No results found. Try a different search term.</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-gray-300 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link
            href="/support"
            className="inline-block px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-bold"
          >
            💬 Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
