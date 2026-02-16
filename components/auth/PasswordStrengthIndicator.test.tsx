import { render, screen } from '@testing-library/react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  it('should not render when password is empty', () => {
    const { container } = render(<PasswordStrengthIndicator password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should display "Weak" for passwords with low strength', () => {
    render(<PasswordStrengthIndicator password="abc123" />);
    expect(screen.getByText(/Weak/i)).toBeInTheDocument();
  });

  it('should display "Medium" for passwords with moderate strength', () => {
    // Password with length + uppercase + lowercase = score 3
    render(<PasswordStrengthIndicator password="Abcdefgh" />);
    expect(screen.getByText(/Medium/i)).toBeInTheDocument();
  });

  it('should display "Strong" for passwords with high strength', () => {
    render(<PasswordStrengthIndicator password="Abcd1234!@#$" />);
    expect(screen.getByText(/Strong/i)).toBeInTheDocument();
  });

  it('should display score indicator', () => {
    render(<PasswordStrengthIndicator password="Test123!" />);
    // Should show a score like "4/6" or similar
    expect(screen.getByText(/\/6$/)).toBeInTheDocument();
  });

  it('should have proper ARIA attributes for accessibility', () => {
    render(<PasswordStrengthIndicator password="test123" />);
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-live', 'polite');
  });

  describe('strength level calculations', () => {
    it('should show weak for short password', () => {
      render(<PasswordStrengthIndicator password="abc" />);
      expect(screen.getByText(/Weak/i)).toBeInTheDocument();
    });

    it('should show weak for password with only lowercase', () => {
      render(<PasswordStrengthIndicator password="abcdefgh" />);
      expect(screen.getByText(/Weak/i)).toBeInTheDocument();
    });

    it('should show medium for password meeting minimum requirements', () => {
      // Score 3: length >= 8 + uppercase + lowercase
      render(<PasswordStrengthIndicator password="Abcdefgh" />);
      expect(screen.getByText(/Medium/i)).toBeInTheDocument();
    });

    it('should show strong for password with all character types and good length', () => {
      render(<PasswordStrengthIndicator password="MyP@ssw0rd123" />);
      expect(screen.getByText(/Strong/i)).toBeInTheDocument();
    });
  });
});
