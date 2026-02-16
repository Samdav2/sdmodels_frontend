import { render, screen, waitFor } from '@testing-library/react';
import BiometricIcon from './BiometricIcon';

describe('BiometricIcon', () => {
  it('renders the biometric icon', () => {
    const { container } = render(<BiometricIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('displays idle state by default', () => {
    const { container } = render(<BiometricIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Icon should be visible but not scanning
    expect(container.querySelector('.text-cyan-400')).toBeInTheDocument();
  });

  it('triggers scanning animation when isScanning is true', () => {
    const { container } = render(<BiometricIcon isScanning={true} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Scanning line should be present
    const scanningLine = container.querySelector('.bg-gradient-to-r');
    expect(scanningLine).toBeInTheDocument();
  });

  it('calls onScanComplete after scanning animation completes', async () => {
    const onScanComplete = jest.fn();
    render(<BiometricIcon isScanning={true} onScanComplete={onScanComplete} />);
    
    // Wait for animation to complete (1.5s * 3 repeats = 4.5s)
    await waitFor(
      () => {
        expect(onScanComplete).toHaveBeenCalled();
      },
      { timeout: 5000 }
    );
  });

  it('does not show scanning line when not scanning', () => {
    const { container } = render(<BiometricIcon isScanning={false} />);
    const scanningLine = container.querySelector('.bg-gradient-to-r');
    expect(scanningLine).not.toBeInTheDocument();
  });

  it('has proper ARIA attributes for accessibility', () => {
    const { container } = render(<BiometricIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
