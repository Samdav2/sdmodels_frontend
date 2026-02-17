"use client";

import Link from "next/link";
import { useState } from "react";
import { useSupport, useFAQs } from "@/lib/api/hooks/useSupport";

export default function SupportPage() {
  const { tickets, loading: ticketsLoading, createTicket } = useSupport();
  const { faqs, loading: faqsLoading } = useFAQs();
  
  const [activeChat, setActiveChat] = useState<'user' | 'admin'>('user');
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "support",
      text: "Hello! Welcome to SDModels Support. How can I help you today?",
      time: "10:30 AM",
    },
  ]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
    
    // TODO: Send message to backend via API
    // For now, simulate support response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: "support",
        text: "Thank you for your message! Our team is reviewing your request and will respond shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">SDModels Support</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link
              href="/community"
              className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-sm font-semibold"
            >
              👥 Community
            </Link>
            <Link
              href="/marketplace"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-semibold"
            >
              🛒 Marketplace
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-orange-500/20 bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-teal-900/20">
        <div className="max-w-[2000px] mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            How Can We <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">Help You?</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            24/7 support from our expert team. Average response time: 2 minutes
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition">
              💬 Start Live Chat
            </button>
            <button className="px-6 py-3 bg-slate-800 border border-blue-500/30 text-blue-400 rounded-xl font-semibold hover:bg-blue-500/20 transition">
              📧 Email Support
            </button>
            <button className="px-6 py-3 bg-slate-800 border border-blue-500/30 text-blue-400 rounded-xl font-semibold hover:bg-blue-500/20 transition">
              📞 Schedule Call
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2000px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left - Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat Tabs */}
            <div className="flex gap-2 bg-slate-900/50 p-2 rounded-xl border border-orange-500/20">
              <button
                onClick={() => setActiveChat('user')}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  activeChat === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                💬 Live Chat
              </button>
              <button
                onClick={() => setActiveChat('admin')}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  activeChat === 'admin'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🎫 My Tickets
              </button>
            </div>

            {/* Live Chat */}
            {activeChat === 'user' && (
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-b border-blue-500/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                      👨‍💼
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Support Team</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-green-400">Online</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto bg-slate-950/50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500'
                          : 'bg-slate-800 border border-slate-700'
                      } rounded-2xl p-4`}>
                        <p className="text-white text-sm mb-1">{message.text}</p>
                        <span className="text-xs text-gray-300 opacity-70">{message.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-slate-700 bg-slate-900/80">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition"
                    >
                      Send
                    </button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1 bg-slate-800 border border-slate-700 text-gray-400 rounded-full text-xs hover:border-blue-500/50 transition">
                      📎 Attach File
                    </button>
                    <button className="px-3 py-1 bg-slate-800 border border-slate-700 text-gray-400 rounded-full text-xs hover:border-blue-500/50 transition">
                      📸 Screenshot
                    </button>
                    <button className="px-3 py-1 bg-slate-800 border border-slate-700 text-gray-400 rounded-full text-xs hover:border-blue-500/50 transition">
                      😊 Emoji
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tickets */}
            {activeChat === 'admin' && (
              <div className="space-y-4">
                <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition">
                  ➕ Create New Ticket
                </button>
                
                {ticketsLoading ? (
                  <div className="text-center py-8 text-slate-400">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No tickets yet</div>
                ) : (
                  tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 hover:border-blue-500/50 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">{ticket.title}</h3>
                        <p className="text-gray-400 text-sm">Last updated: {new Date(ticket.updated_at || ticket.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ticket.status === 'open'
                          ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                          : ticket.status === 'in-progress'
                          ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                          : 'bg-green-500/20 border border-green-500/30 text-green-400'
                      }`}>
                        {ticket.status === 'open' ? '🔵 Open' : ticket.status === 'in-progress' ? '🟡 In Progress' : '🟢 Resolved'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ticket.priority === 'high'
                          ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                          : ticket.priority === 'medium'
                          ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
                          : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                      }`}>
                        {ticket.priority === 'high' ? '🔴 High' : ticket.priority === 'medium' ? '🟠 Medium' : '⚪ Low'} Priority
                      </span>
                      
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right - FAQs & Resources */}
          <div className="lg:col-span-1 space-y-6">
            {/* FAQs */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <span>❓</span>
                <span>Frequently Asked</span>
              </h3>
              
              <div className="space-y-3">
                {faqsLoading ? (
                  <div className="text-center py-4 text-slate-400">Loading FAQs...</div>
                ) : faqs.length === 0 ? (
                  <div className="text-center py-4 text-slate-400">No FAQs available</div>
                ) : (
                  faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-blue-500/50 transition"
                  >
                    <summary className="text-white font-semibold text-sm">
                      {faq.question}
                    </summary>
                    <p className="text-gray-400 text-sm mt-2">
                      {faq.answer}
                    </p>
                  </details>
                  ))
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4">📞 Contact Us</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <div className="text-gray-400">Email</div>
                    <div className="text-white font-semibold">support@sdmodels.com</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="text-gray-400">Live Chat</div>
                    <div className="text-green-400 font-semibold">Available 24/7</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏱️</span>
                  <div>
                    <div className="text-gray-400">Response Time</div>
                    <div className="text-white font-semibold">~2 minutes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4">📚 Resources</h3>
              
              <div className="space-y-2">
                <Link
                  href="/docs"
                  className="block p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition"
                >
                  <div className="text-white font-semibold text-sm">📖 Documentation</div>
                  <div className="text-gray-400 text-xs">Complete guides & tutorials</div>
                </Link>
                
                <Link
                  href="/learn"
                  className="block p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition"
                >
                  <div className="text-white font-semibold text-sm">🎓 Learning Center</div>
                  <div className="text-gray-400 text-xs">Video tutorials & courses</div>
                </Link>
                
                <Link
                  href="/community"
                  className="block p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition"
                >
                  <div className="text-white font-semibold text-sm">👥 Community Forum</div>
                  <div className="text-gray-400 text-xs">Ask the community</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
