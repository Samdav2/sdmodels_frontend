'use client';

import { useState } from 'react';
import BiometricIcon from './BiometricIcon';

export default function BiometricIconExample() {
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    console.log('Biometric scan complete!');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-cyan-400">
          BiometricIcon Component
        </h1>
        <p className="text-slate-400 max-w-md">
          A futuristic fingerprint scanner icon with animated scanning effects.
          Click the button below to trigger the scanning animation.
        </p>
      </div>

      {/* Example 1: Idle State */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-xl p-8 space-y-4">
        <h2 className="text-xl font-semibold text-cyan-300 text-center">
          Idle State
        </h2>
        <div className="flex items-center justify-center">
          <BiometricIcon />
        </div>
        <p className="text-sm text-slate-400 text-center">
          Default state with subtle glow
        </p>
      </div>

      {/* Example 2: Interactive Scanning */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-xl p-8 space-y-4">
        <h2 className="text-xl font-semibold text-cyan-300 text-center">
          Interactive Scanning
        </h2>
        <div className="flex items-center justify-center">
          <BiometricIcon 
            isScanning={isScanning} 
            onScanComplete={handleScanComplete}
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className={`
              px-6 py-2 rounded-lg font-medium
              transition-all duration-300
              ${isScanning
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-500 text-white hover:bg-cyan-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              }
            `}
          >
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
        <p className="text-sm text-slate-400 text-center">
          {isScanning 
            ? 'Scanning in progress with pulsing and glowing effects'
            : 'Click button to trigger scanning animation'
          }
        </p>
      </div>

      {/* Example 3: In Form Context */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-xl p-8 space-y-4 max-w-md w-full">
        <h2 className="text-xl font-semibold text-cyan-300 text-center">
          In Form Context
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <button
              className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
            >
              Login
            </button>
            <div className="ml-4">
              <BiometricIcon />
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-400 text-center">
          Typical usage next to a submit button
        </p>
      </div>

      {/* Usage Instructions */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 max-w-2xl w-full">
        <h3 className="text-lg font-semibold text-cyan-300 mb-3">
          Usage
        </h3>
        <pre className="text-sm text-slate-300 bg-slate-950 p-4 rounded-lg overflow-x-auto">
{`import BiometricIcon from './BiometricIcon';

// Basic usage (idle state)
<BiometricIcon />

// With scanning animation
<BiometricIcon 
  isScanning={true}
  onScanComplete={() => console.log('Done!')}
/>`}
        </pre>
      </div>
    </div>
  );
}
