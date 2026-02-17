"use client";

import Link from "next/link";

export default function CookiesPage() {
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
              href="/marketplace"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-semibold"
            >
              🛒 Marketplace
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-900/50 border border-orange-500/20 rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-400 mb-8">Last Updated: February 16, 2024</p>

          <div className="prose prose-invert prose-orange max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies?</h2>
              <p className="text-gray-300 leading-relaxed">
                Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences and analyzing how you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-bold text-orange-400 mb-3">1. Essential Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Required for the platform to function. These include authentication, security, and session management.
              </p>

              <h3 className="text-xl font-bold text-orange-400 mb-3">2. Performance Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Help us understand how visitors use our site by collecting anonymous analytics data.
              </p>

              <h3 className="text-xl font-bold text-orange-400 mb-3">3. Functionality Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Remember your preferences like language, theme, and display settings.
              </p>

              <h3 className="text-xl font-bold text-orange-400 mb-3">4. Targeting Cookies</h3>
              <p className="text-gray-300 leading-relaxed">
                Used to deliver relevant advertisements and track campaign effectiveness.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Managing Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                You can control cookies through:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Browser settings (block or delete cookies)</li>
                <li>Our cookie consent banner</li>
                <li>Account preferences for logged-in users</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                Note: Blocking essential cookies may affect platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Cookies</h2>
              <p className="text-gray-300 leading-relaxed">
                We use services like Google Analytics, Stripe, and social media platforms that may set their own cookies. Please review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Updates</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this policy to reflect changes in technology or regulations. Check back periodically for updates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
              <p className="text-gray-300 leading-relaxed">
                Questions about cookies? Contact us at privacy@sdmodels.com
              </p>
            </section>
          </div>

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <h3 className="text-white font-bold mb-4">Related Documents</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/terms" className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 hover:border-orange-500/50 hover:text-white rounded-lg text-sm font-semibold transition">
                Terms of Service
              </Link>
              <Link href="/privacy" className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 hover:border-orange-500/50 hover:text-white rounded-lg text-sm font-semibold transition">
                Privacy Policy
              </Link>
              <Link href="/dmca" className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 hover:border-orange-500/50 hover:text-white rounded-lg text-sm font-semibold transition">
                DMCA Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
