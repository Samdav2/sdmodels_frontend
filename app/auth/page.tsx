"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ParticleBackground from '@/components/auth/ParticleBackground';
import AuthTerminal from '@/components/auth/AuthTerminal';

function AuthPageContent() {
  const searchParams = useSearchParams();
  const [showExpiredMessage, setShowExpiredMessage] = useState(false);

  useEffect(() => {
    const session = searchParams.get('session');
    if (session === 'expired') {
      setShowExpiredMessage(true);
      // Hide message after 5 seconds
      setTimeout(() => setShowExpiredMessage(false), 5000);
    }
  }, [searchParams]);

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground variant="starfield" />

      {/* Session Expired Message */}
      {showExpiredMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg border border-red-400">
          <p className="font-semibold">⚠️ Your session has expired. Please login again.</p>
        </div>
      )}

      {/* Auth Terminal Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <AuthTerminal initialMode="login" />
      </div>

      {/* Decorative Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 107, 53, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 53, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        aria-hidden="true"
      />

      {/* Radial Gradient Spotlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-orange-400 text-xl">Loading...</div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
