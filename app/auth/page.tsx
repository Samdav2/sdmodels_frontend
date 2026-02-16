import ParticleBackground from '@/components/auth/ParticleBackground';
import AuthTerminal from '@/components/auth/AuthTerminal';

export default function AuthPage() {
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground variant="starfield" />

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
