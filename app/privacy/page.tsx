"use client";

import Link from "next/link";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-400 mb-8">Last Updated: February 16, 2024</p>

          <div className="prose prose-invert prose-orange max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <h3 className="text-xl font-bold text-orange-400 mb-3">1.1 Account Information</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Email address and username</li>
                <li>Password (encrypted)</li>
                <li>Profile information (name, bio, avatar)</li>
                <li>Payment information (processed securely by third parties)</li>
              </ul>

              <h3 className="text-xl font-bold text-orange-400 mb-3 mt-4">1.2 Usage Data</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                We automatically collect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Models viewed and downloaded</li>
                <li>Search queries and filters used</li>
              </ul>

              <h3 className="text-xl font-bold text-orange-400 mb-3 mt-4">1.3 Content You Upload</h3>
              <p className="text-gray-300 leading-relaxed">
                3D models, images, comments, and other content you share on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                We use collected information to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Provide and improve our services</li>
                <li>Process transactions and payments</li>
                <li>Send important updates and notifications</li>
                <li>Personalize your experience</li>
                <li>Prevent fraud and ensure security</li>
                <li>Analyze platform usage and trends</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                We do not sell your personal information. We may share data with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Payment processors (Stripe, PayPal) for transactions</li>
                <li>Cloud storage providers for file hosting</li>
                <li>Analytics services to improve our platform</li>
                <li>Law enforcement when legally required</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                We implement industry-standard security measures including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
              <p className="text-gray-300 leading-relaxed">
                We use cookies and similar technologies to enhance your experience. See our Cookie Policy for details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not intended for users under 13. We do not knowingly collect information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this policy periodically. We'll notify you of significant changes via email or platform notification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                For privacy concerns or data requests, contact us at privacy@sdmodels.com
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
