import { render, screen, fireEvent } from '@testing-library/react';
import FloatingLabelInput from './FloatingLabelInput';

describe('FloatingLabelInput', () => {
  it('renders with label', () => {
    render(
      <FloatingLabelInput
        label="Email"
        type="email"
        value=""
        onChange={() => {}}
      />
    );
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <FloatingLabelInput
        label="Email"
        type="email"
        value=""
        onChange={() => {}}
        error="Invalid email format"
      />
    );
    
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email format');
  });

  it('clears error when user types', async () => {
    const mockOnChange = jest.fn();
    const { rerender } = render(
      <FloatingLabelInput
        label="Email"
        type="email"
        value=""
        onChange={mockOnChange}
        error="Invalid email format"
      />
    );
    
    // Error should be visible initially
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email format');
    
    const input = screen.getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('test@example.com');
    
    // Simulate parent clearing error on change
    rerender(
      <FloatingLabelInput
        label="Email"
        type="email"
        value="test@example.com"
        onChange={mockOnChange}
        error={undefined}
      />
    );
    
    // After rerender without error, the alert should eventually be removed
    // (AnimatePresence may keep it briefly during exit animation)
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('calls onFocus when input is focused', () => {
    const mockOnFocus = jest.fn();
    render(
      <FloatingLabelInput
        label="Email"
        type="email"
        value=""
        onChange={() => {}}
        onFocus={mockOnFocus}
      />
    );
    
    const input = screen.getByLabelText('Email');
    fireEvent.focus(input);
    
    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('calls onBlur when input loses focus', () => {
    const mockOnBlur = jest.fn();
    render(
      <FloatingLabelInput
        label="Email"
        type="email"
        value=""
        onChange={() => {}}
        onBlur={mockOnBlur}
      />
    );
    
    const input = screen.getByLabelText('Email');
    fireEvent.focus(input);
    fireEvent.blur(input);
    
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('shows required indicator when required prop is true', () => {
    render(
      <FloatingLabelInput
        label="Password"
        type="password"
        value=""
        onChange={() => {}}
        required={true}
      />
    );
    
    const input = screen.getByLabelText('Password');
    expect(input).toBeRequired();
  });

  it('applies error styling when error is present', () => {
    render(
      <FloatingLabelInput
        label="Email"
        type="email"
        value=""
        onChange={() => {}}
        error="Invalid email"
      />
    );
    
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles value changes correctly', () => {
    const mockOnChange = jest.fn();
    render(
      <FloatingLabelInput
        label="Username"
        type="text"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText('Username');
    fireEvent.change(input, { target: { value: 'john_doe' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('john_doe');
  });
});
