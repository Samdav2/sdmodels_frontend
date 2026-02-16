/**
 * Email validation utility for Neural Link Auth
 * Validates email addresses according to RFC 5322 standard
 */

/**
 * Validates an email address using RFC 5322 compliant regex pattern
 * 
 * @param email - The email string to validate
 * @returns true if the email is valid, false otherwise
 * 
 * Requirements: 3.3, 8.2
 * Property 5: Email validation correctness
 */
export function validateEmail(email: string): boolean {
  // Handle null, undefined, or non-string inputs
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Trim whitespace
  const trimmedEmail = email.trim();

  // Check maximum length (RFC 5321)
  if (trimmedEmail.length > 254) {
    return false;
  }

  // Check for consecutive dots (not allowed in local or domain part)
  if (trimmedEmail.includes('..')) {
    return false;
  }

  // Check for leading or trailing dots in local part
  const [localPart, ...domainParts] = trimmedEmail.split('@');
  if (!localPart || domainParts.length !== 1) {
    return false;
  }

  const domain = domainParts[0];
  
  // Local part cannot start or end with a dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }

  // Domain must contain at least one dot (TLD requirement)
  if (!domain.includes('.')) {
    return false;
  }

  // RFC 5322 compliant email regex pattern
  // This pattern validates:
  // - Local part: alphanumeric, dots, hyphens, underscores, plus signs (common subset of RFC 5322)
  // - @ symbol (required)
  // - Domain part: alphanumeric, dots, hyphens
  // - TLD: at least 2 characters
  const emailRegex = /^[a-zA-Z0-9._+%-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  return emailRegex.test(trimmedEmail);
}

/**
 * Calculates password strength on a scale of 0-4
 * 
 * Scoring criteria:
 * - Length >= 8: +1 point
 * - Contains uppercase letter: +1 point
 * - Contains lowercase letter: +1 point
 * - Contains number: +1 point
 * - Contains special character: +1 point
 * - Length >= 12 AND has all character types: +1 bonus point
 * 
 * Score interpretation:
 * - 0-2: Weak (red)
 * - 3: Medium (yellow)
 * - 4+: Strong (green)
 * 
 * @param password - The password string to evaluate
 * @returns Strength score from 0 to 6
 * 
 * Requirements: 3.6
 */
export function calculatePasswordStrength(password: string): number {
  if (!password || typeof password !== 'string') {
    return 0;
  }

  let score = 0;

  // Length check
  if (password.length >= 8) score++;

  // Character type checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasUppercase) score++;
  if (hasLowercase) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  // Bonus point for long password with all character types
  if (password.length >= 12 && hasUppercase && hasLowercase && hasNumber && hasSpecial) {
    score++;
  }

  return score;
}
