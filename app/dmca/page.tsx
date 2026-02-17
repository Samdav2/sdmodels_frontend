"use client";

import Link from "next/link";

export default function DMCAPage() {
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
            DMCA Policy
          </h1>
          <p className="text-gray-400 mb-8">Last Updated: February 16, 2024</p>

          <div className="prose prose-invert prose-orange max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Copyright Infringement Notice</h2>
              <p className="text-gray-300 leading-relaxed">
                SDModels respects intellectual property rights and expects users to do the same. We respond to valid DMCA takedown notices and will remove infringing content promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Filing a DMCA Takedown Notice</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                If you believe your copyrighted work has been infringed, please provide:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Your contact information (name, address, email, phone)</li>
                <li>Description of the copyrighted work</li>
                <li>URL of the infringing content on SDModels</li>
                <li>Statement of good faith belief</li>
                <li>Statement that the information is accurate</li>
                <li>Physical or electronic signature</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Send Notice To</h2>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <p className="text-white font-bold mb-2">DMCA Agent</p>
                <p className="text-gray-300">Email: dmca@sdmodels.com</p>
                <p className="text-gray-300">Subject: DMCA Takedown Notice</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Counter-Notice</h2>
              <p className="text-gray-300 leading-relaxed">
                If you believe content was removed in error, you may file a counter-notice with the same information plus a statement consenting to jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Repeat Infringers</h2>
              <p className="text-gray-300 leading-relaxed">
                We will terminate accounts of repeat infringers in accordance with the DMCA.
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
              <Link href="/cookies" className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 hover:border-orange-500/50 hover:text-white rounded-lg text-sm font-semibold transition">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
