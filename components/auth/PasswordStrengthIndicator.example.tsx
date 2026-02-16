/**
 * Example usage of PasswordStrengthIndicator component
 * 
 * This file demonstrates how to integrate the PasswordStrengthIndicator
 * with FloatingLabelInput in a signup form.
 */

'use client';

import { useState } from 'react';
import FloatingLabelInput from './FloatingLabelInput';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

export default function PasswordInputExample() {
  const [password, setPassword] = useState('');

  return (
    <div className="space-y-4 max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Password Strength Example
      </h2>
      
      {/* Password Input with Strength Indicator */}
      <div>
        <FloatingLabelInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        
        {/* Strength indicator appears below the input */}
        <PasswordStrengthIndicator password={password} />
      </div>

      {/* Visual feedback for testing */}
      <div className="mt-8 p-4 bg-slate-800/30 rounded-lg backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">
          Try these examples:
        </h3>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>• "abc" - Weak (score: 1)</li>
          <li>• "abcdefgh" - Weak (score: 2)</li>
          <li>• "Abcdefgh" - Medium (score: 3)</li>
          <li>• "Abcd1234" - Strong (score: 4)</li>
          <li>• "Abcd1234!" - Strong (score: 5)</li>
          <li>• "MyP@ssw0rd123" - Strong (score: 6)</li>
        </ul>
      </div>
    </div>
  );
}
