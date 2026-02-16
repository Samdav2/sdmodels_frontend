'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingLabelInput from './FloatingLabelInput';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import BiometricIcon from './BiometricIcon';
import { validateEmail } from '@/lib/auth/validation';
import type { AuthMode, ValidationError } from '@/types/auth';

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (data: FormData) => Promise<void>;
  onAuthStateChange: (state: 'idle' | 'typing' | 'success' | 'error') => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

export default function AuthForm({ mode, onSubmit, onAuthStateChange }: AuthFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Clear errors for a specific field
  const clearFieldError = (field: string) => {
    setErrors(prev => prev.filter(err => err.field !== field));
  };

  // Handle field changes
  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearFieldError(field);
    onAuthStateChange('typing');
  };

  // Validate form
  const validateForm = (): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    // Email validation
    if (!formData.email.trim()) {
      newErrors.push({ field: 'email', message: 'Email is required' });
    } else if (!validateEmail(formData.email)) {
      newErrors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    // Password validation
    if (!formData.password) {
      newErrors.push({ field: 'password', message: 'Password is required' });
    } else if (formData.password.length < 8) {
      newErrors.push({ field: 'password', message: 'Password must be at least 8 characters' });
    }

    // Signup-specific validation
    if (mode === 'signup') {
      // Name validation
      if (!formData.name?.trim()) {
        newErrors.push({ field: 'name', message: 'Name is required' });
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.push({ field: 'confirmPassword', message: 'Please confirm your password' });
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
      }
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      onAuthStateChange('error');
      return;
    }

    // Start biometric scanning animation
    setIsScanning(true);
    setIsSubmitting(true);

    // Wait for scanning animation to complete
    await new Promise(resolve => setTimeout(resolve, 4500)); // 1.5s * 3 repeats

    try {
      await onSubmit(formData);
      onAuthStateChange('success');
    } catch (error) {
      onAuthStateChange('error');
      setErrors([{ 
        field: 'general', 
        message: error instanceof Error ? error.message : 'Authentication failed. Please try again.' 
      }]);
    } finally {
      setIsSubmitting(false);
      setIsScanning(false);
    }
  };

  // Get error for a specific field
  const getFieldError = (field: string): string | undefined => {
    return errors.find(err => err.field === field)?.message;
  };

  // Get general error (not field-specific)
  const generalError = errors.find(err => err.field === 'general')?.message;

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <motion.form
      key={mode}
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="w-full space-y-5"
      id="auth-form"
      role="tabpanel"
    >
      {/* General Error Message */}
      <AnimatePresence>
        {generalError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/30"
            role="alert"
          >
            <p className="text-red-400 text-sm">{generalError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name Field (Signup only) */}
      <AnimatePresence mode="wait">
        {mode === 'signup' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FloatingLabelInput
              label="Full Name"
              type="text"
              value={formData.name || ''}
              onChange={(value) => handleFieldChange('name', value)}
              error={getFieldError('name')}
              required
              onFocus={() => onAuthStateChange('typing')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Field */}
      <FloatingLabelInput
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(value) => handleFieldChange('email', value)}
        error={getFieldError('email')}
        required
        onFocus={() => onAuthStateChange('typing')}
      />

      {/* Password Field */}
      <div className="space-y-1">
        <FloatingLabelInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => handleFieldChange('password', value)}
          error={getFieldError('password')}
          required
          onFocus={() => onAuthStateChange('typing')}
        />
        
        {/* Password Strength Indicator (Signup only) */}
        {mode === 'signup' && formData.password && (
          <PasswordStrengthIndicator password={formData.password} />
        )}
      </div>

      {/* Confirm Password Field (Signup only) */}
      <AnimatePresence mode="wait">
        {mode === 'signup' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FloatingLabelInput
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword || ''}
              onChange={(value) => handleFieldChange('confirmPassword', value)}
              error={getFieldError('confirmPassword')}
              required
              onFocus={() => onAuthStateChange('typing')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button with Biometric Icon */}
      <div className="pt-4">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className={`
            w-full py-4 rounded-lg
            bg-gradient-to-r from-orange-500 to-red-600
            text-white font-semibold text-base
            transition-all duration-200
            flex items-center justify-center gap-3
            ${isSubmitting 
              ? 'opacity-70 cursor-not-allowed' 
              : 'hover:from-orange-600 hover:to-red-700 hover:shadow-[0_0_30px_rgba(255,107,53,0.5)]'
            }
          `}
          aria-label={mode === 'login' ? 'Log in' : 'Sign up'}
        >
          <span>{mode === 'login' ? 'Log In' : 'Sign Up'}</span>
          
          {/* Biometric Icon */}
          <div className="w-12 h-12 flex items-center justify-center">
            <BiometricIcon 
              isScanning={isScanning}
              onScanComplete={() => {
                // Animation complete, form submission continues
              }}
            />
          </div>
        </motion.button>
      </div>

      {/* Forgot Password Link (Login only) */}
      {mode === 'login' && (
        <div className="text-center pt-2">
          <button
            type="button"
            className="text-sm text-orange-400 hover:text-orange-300 transition-colors duration-200"
            onClick={() => {
              // TODO: Implement forgot password flow
              console.log('Forgot password clicked');
            }}
          >
            Forgot your password?
          </button>
        </div>
      )}
    </motion.form>
  );
}
