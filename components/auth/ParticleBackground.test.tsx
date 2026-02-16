import { render, screen } from '@testing-library/react';
import ParticleBackground from './ParticleBackground';

// Mock react-tsparticles
jest.mock('react-tsparticles', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => <div data-testid={id}>Particles Mock</div>,
}));

jest.mock('tsparticles-slim', () => ({
  loadSlim: jest.fn(),
}));

describe('ParticleBackground', () => {
  beforeEach(() => {
    // Reset window.innerWidth for each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('renders without crashing', () => {
    render(<ParticleBackground />);
    expect(screen.getByTestId('particle-background')).toBeInTheDocument();
  });

  it('renders with starfield variant by default', () => {
    render(<ParticleBackground />);
    const container = screen.getByTestId('particle-background');
    expect(container).toBeInTheDocument();
  });

  it('renders with digitalRain variant when specified', () => {
    render(<ParticleBackground variant="digitalRain" />);
    const container = screen.getByTestId('particle-background');
    expect(container).toBeInTheDocument();
  });

  it('has fixed positioning and covers full screen', () => {
    const { container } = render(<ParticleBackground />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('fixed', 'inset-0', '-z-10');
  });

  it('is hidden from screen readers', () => {
    const { container } = render(<ParticleBackground />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  describe('Mobile optimization', () => {
    it('detects mobile viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<ParticleBackground />);
      // Component should render successfully with mobile optimizations
      expect(screen.getByTestId('particle-background')).toBeInTheDocument();
    });

    it('detects desktop viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      render(<ParticleBackground />);
      // Component should render successfully with desktop settings
      expect(screen.getByTestId('particle-background')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('does not interfere with keyboard navigation', () => {
      const { container } = render(<ParticleBackground />);
      const wrapper = container.firstChild as HTMLElement;
      
      // Should not have tabIndex
      expect(wrapper).not.toHaveAttribute('tabIndex');
    });

    it('is positioned behind content with negative z-index', () => {
      const { container } = render(<ParticleBackground />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('-z-10');
    });
  });
});
