import { validateEmail } from './validation';

describe('validateEmail', () => {
  describe('valid emails', () => {
    it('should accept standard email format', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should accept emails with numbers', () => {
      expect(validateEmail('user123@example.com')).toBe(true);
      expect(validateEmail('123@example.com')).toBe(true);
    });

    it('should accept emails with special characters in local part', () => {
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
      expect(validateEmail('user_name@example.com')).toBe(true);
      expect(validateEmail('user-name@example.com')).toBe(true);
    });

    it('should accept emails with subdomains', () => {
      expect(validateEmail('user@mail.example.com')).toBe(true);
      expect(validateEmail('user@sub.mail.example.com')).toBe(true);
    });

    it('should accept emails with hyphens in domain', () => {
      expect(validateEmail('user@my-domain.com')).toBe(true);
    });
  });

  describe('invalid emails', () => {
    it('should reject emails without @ symbol', () => {
      expect(validateEmail('userexample.com')).toBe(false);
      expect(validateEmail('user.example.com')).toBe(false);
    });

    it('should reject emails without domain', () => {
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@.')).toBe(false);
    });

    it('should reject emails without local part', () => {
      expect(validateEmail('@example.com')).toBe(false);
    });

    it('should reject emails with spaces', () => {
      expect(validateEmail('user name@example.com')).toBe(false);
      expect(validateEmail('user@exam ple.com')).toBe(false);
    });

    it('should reject emails with multiple @ symbols', () => {
      expect(validateEmail('user@@example.com')).toBe(false);
      expect(validateEmail('user@name@example.com')).toBe(false);
    });

    it('should reject empty or whitespace-only strings', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('   ')).toBe(false);
    });

    it('should reject null or undefined', () => {
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
    });

    it('should reject emails exceeding maximum length (254 chars)', () => {
      const longEmail = 'a'.repeat(250) + '@example.com'; // 262 chars total
      expect(validateEmail(longEmail)).toBe(false);
    });

    it('should reject emails without TLD', () => {
      expect(validateEmail('user@example')).toBe(false);
    });

    it('should reject emails with consecutive dots', () => {
      expect(validateEmail('user..name@example.com')).toBe(false);
      expect(validateEmail('user@example..com')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should trim whitespace before validation', () => {
      expect(validateEmail('  user@example.com  ')).toBe(true);
      expect(validateEmail('\tuser@example.com\n')).toBe(true);
    });

    it('should handle minimum valid email length', () => {
      expect(validateEmail('a@b.c')).toBe(true);
    });
  });
});
