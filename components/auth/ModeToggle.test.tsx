import { render, screen, fireEvent } from '@testing-library/react';
import ModeToggle from './ModeToggle';

describe('ModeToggle', () => {
  it('renders login and sign up buttons', () => {
    const mockToggle = jest.fn();
    render(<ModeToggle mode="login" onToggle={mockToggle} />);

    expect(screen.getByRole('button', { name: /switch to login mode/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to sign up mode/i })).toBeInTheDocument();
  });

  it('displays login mode indicator text', () => {
    const mockToggle = jest.fn();
    render(<ModeToggle mode="login" onToggle={mockToggle} />);

    expect(screen.getByText(/welcome back to neural link/i)).toBeInTheDocument();
  });

  it('displays signup mode indicator text', () => {
    const mockToggle = jest.fn();
    render(<ModeToggle mode="signup" onToggle={mockToggle} />);

    expect(screen.getByText(/initialize new neural link account/i)).toBeInTheDocument();
  });

  it('calls onToggle with "login" when login button is clicked', () => {
    const mockToggle = jest.fn();
    render(<ModeToggle mode="signup" onToggle={mockToggle} />);

    const loginButton = screen.getByRole('button', { name: /switch to login mode/i });
    fireEvent.click(loginButton);

    expect(mockToggle).toHaveBeenCalledWith('login');
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle with "signup" when sign up button is clicked', () => {
    const mockToggle = jest.fn();
    render(<ModeToggle mode="login" onToggle={mockToggle} />);

    const signupButton = screen.getByRole('button', { name: /switch to sign up mode/i });
    fireEvent.click(signupButton);

    expect(mockToggle).toHaveBeenCalledWith('signup');
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('sets aria-pressed to true for active mode', () => {
    const mockToggle = jest.fn();
    render(<ModeToggle mode="login" onToggle={mockToggle} />);

    const loginButton = screen.getByRole('button', { name: /switch to login mode/i });
    const signupButton = screen.getByRole('button', { name: /switch to sign up mode/i });

    expect(loginButton).toHaveAttribute('aria-pressed', 'true');
    expect(signupButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('sets aria-pressed to true for signup mode', () => {
    const mockToggle = jest.fn();
    render(<ModeToggle mode="signup" onToggle={mockToggle} />);

    const loginButton = screen.getByRole('button', { name: /switch to login mode/i });
    const signupButton = screen.getByRole('button', { name: /switch to sign up mode/i });

    expect(loginButton).toHaveAttribute('aria-pressed', 'false');
    expect(signupButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('applies correct styling for active login mode', () => {
    const mockToggle = jest.fn();
    render(<ModeToggle mode="login" onToggle={mockToggle} />);

    const loginButton = screen.getByRole('button', { name: /switch to login mode/i });
    expect(loginButton).toHaveClass('text-white');
  });

  it('applies correct styling for active signup mode', () => {
    const mockToggle = jest.fn();
    render(<ModeToggle mode="signup" onToggle={mockToggle} />);

    const signupButton = screen.getByRole('button', { name: /switch to sign up mode/i });
    expect(signupButton).toHaveClass('text-white');
  });

  it('applies inactive styling for non-active mode', () => {
    const mockToggle = jest.fn();
    render(<ModeToggle mode="login" onToggle={mockToggle} />);

    const signupButton = screen.getByRole('button', { name: /switch to sign up mode/i });
    expect(signupButton).toHaveClass('text-slate-400');
  });
});
