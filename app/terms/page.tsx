"use client";

import Link from "next/link";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-gray-400 mb-8">Last Updated: February 16, 2024</p>

          <div className="prose prose-invert prose-orange max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using SDModels ("the Platform"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. User Accounts</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Content Ownership & Licensing</h2>
              <h3 className="text-xl font-bold text-orange-400 mb-3">3.1 Creator Content</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                Creators retain full ownership of their 3D models and content. By uploading content, you grant SDModels a non-exclusive license to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mb-4">
                <li>Display and distribute your content on the Platform</li>
                <li>Use thumbnails and previews for promotional purposes</li>
                <li>Process and optimize files for platform delivery</li>
              </ul>

              <h3 className="text-xl font-bold text-orange-400 mb-3">3.2 Buyer License</h3>
              <p className="text-gray-300 leading-relaxed">
                When you purchase a model, you receive a license to use it according to the terms specified by the creator. This typically includes personal and commercial use rights, but does not include redistribution rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Platform Fees</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                SDModels charges a 7.5% platform fee on all transactions. This fee covers:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Payment processing and security</li>
                <li>Platform maintenance and hosting</li>
                <li>Customer support services</li>
                <li>Content delivery network (CDN) costs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Upload content you don't own or have rights to</li>
                <li>Distribute malware or malicious code</li>
                <li>Engage in fraudulent transactions</li>
                <li>Harass or abuse other users</li>
                <li>Attempt to circumvent platform security</li>
                <li>Scrape or data mine platform content</li>
                <li>Resell purchased models without proper licensing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Payment & Refunds</h2>
              <h3 className="text-xl font-bold text-orange-400 mb-3">6.1 Payments</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                All payments are processed securely through our payment partners. We accept credit cards, PayPal, and cryptocurrency.
              </p>

              <h3 className="text-xl font-bold text-orange-400 mb-3">6.2 Refunds</h3>
              <p className="text-gray-300 leading-relaxed">
                Refunds are available within 14 days of purchase if the model is significantly different from its description or contains critical defects. Digital downloads are generally non-refundable once accessed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Content Moderation</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to review, moderate, and remove content that violates our guidelines. This includes content that is illegal, offensive, or infringes on intellectual property rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                We may suspend or terminate your account if you violate these terms. You may also close your account at any time. Upon termination, your right to use the Platform ceases immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                SDModels is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages arising from your use of the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update these terms periodically. Continued use of the Platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact</h2>
              <p className="text-gray-300 leading-relaxed">
                For questions about these terms, contact us at legal@sdmodels.com
              </p>
            </section>
          </div>

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <h3 className="text-white font-bold mb-4">Related Documents</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/privacy" className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 hover:border-orange-500/50 hover:text-white rounded-lg text-sm font-semibold transition">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 hover:border-orange-500/50 hover:text-white rounded-lg text-sm font-semibold transition">
                Cookie Policy
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
