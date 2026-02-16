import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserPathSelector from './UserPathSelector';
import type { UserPath, ModellerProfile, BuyerProfile } from '@/types/auth';

describe('UserPathSelector', () => {
  const mockOnSelect = jest.fn();
  const mockOnProfileUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render the component with title and description', () => {
      render(
        <UserPathSelector
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      expect(screen.getByText('Choose Your Path')).toBeInTheDocument();
      expect(screen.getByText('Select your role in the marketplace')).toBeInTheDocument();
    });

    it('should render both Modeller and Buyer cards', () => {
      render(
        <UserPathSelector
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      expect(screen.getByText('Modeller')).toBeInTheDocument();
      expect(screen.getByText('Create and sell 3D models')).toBeInTheDocument();
      expect(screen.getByText('Buyer')).toBeInTheDocument();
      expect(screen.getByText('Discover and purchase 3D assets')).toBeInTheDocument();
    });

    it('should have proper ARIA labels for accessibility', () => {
      render(
        <UserPathSelector
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      expect(screen.getByLabelText('Select Modeller path')).toBeInTheDocument();
      expect(screen.getByLabelText('Select Buyer path')).toBeInTheDocument();
    });
  });

  describe('Card Selection', () => {
    it('should call onSelect with "modeller" when Modeller card is clicked', () => {
      render(
        <UserPathSelector
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      const modellerCard = screen.getByLabelText('Select Modeller path');
      fireEvent.click(modellerCard);

      expect(mockOnSelect).toHaveBeenCalledWith('modeller');
    });

    it('should call onSelect with "buyer" when Buyer card is clicked', () => {
      render(
        <UserPathSelector
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      const buyerCard = screen.getByLabelText('Select Buyer path');
      fireEvent.click(buyerCard);

      expect(mockOnSelect).toHaveBeenCalledWith('buyer');
    });

    it('should apply selected styling to Modeller card when selected', () => {
      render(
        <UserPathSelector
          selectedPath="modeller"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      const modellerCard = screen.getByLabelText('Select Modeller path');
      expect(modellerCard).toHaveClass('border-cyan-500');
      expect(modellerCard).toHaveAttribute('aria-pressed', 'true');
    });

    it('should apply selected styling to Buyer card when selected', () => {
      render(
        <UserPathSelector
          selectedPath="buyer"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      const buyerCard = screen.getByLabelText('Select Buyer path');
      expect(buyerCard).toHaveClass('border-purple-500');
      expect(buyerCard).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Modeller Fields', () => {
    it('should show Modeller fields when Modeller path is selected', async () => {
      render(
        <UserPathSelector
          selectedPath="modeller"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Modeller Details')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Portfolio link')).toBeInTheDocument();
      expect(screen.getByText('Primary Software')).toBeInTheDocument();
    });

    it('should render all software options', async () => {
      render(
        <UserPathSelector
          selectedPath="modeller"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Select Blender as primary software')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Select Maya as primary software')).toBeInTheDocument();
      expect(screen.getByLabelText('Select Cinema4D as primary software')).toBeInTheDocument();
      expect(screen.getByLabelText('Select Other as primary software')).toBeInTheDocument();
    });

    it('should call onProfileUpdate when portfolio link is changed', async () => {
      render(
        <UserPathSelector
          selectedPath="modeller"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Portfolio link')).toBeInTheDocument();
      });

      const portfolioInput = screen.getByLabelText('Portfolio link');
      fireEvent.change(portfolioInput, { target: { value: 'https://example.com' } });

      expect(mockOnProfileUpdate).toHaveBeenCalledWith({
        primarySoftware: 'Blender',
        portfolioLink: 'https://example.com',
      });
    });

    it('should call onProfileUpdate when software is selected', async () => {
      render(
        <UserPathSelector
          selectedPath="modeller"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Select Maya as primary software')).toBeInTheDocument();
      });

      const mayaButton = screen.getByLabelText('Select Maya as primary software');
      fireEvent.click(mayaButton);

      expect(mockOnProfileUpdate).toHaveBeenCalledWith({
        primarySoftware: 'Maya',
      });
    });

    it('should show custom software input when "Other" is selected', async () => {
      const modellerProfile: ModellerProfile = {
        primarySoftware: 'Other',
      };

      render(
        <UserPathSelector
          selectedPath="modeller"
          modellerProfile={modellerProfile}
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Custom software name')).toBeInTheDocument();
      });
    });

    it('should call onProfileUpdate when custom software is entered', async () => {
      const modellerProfile: ModellerProfile = {
        primarySoftware: 'Other',
      };

      render(
        <UserPathSelector
          selectedPath="modeller"
          modellerProfile={modellerProfile}
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Custom software name')).toBeInTheDocument();
      });

      const customInput = screen.getByLabelText('Custom software name');
      fireEvent.change(customInput, { target: { value: 'Houdini' } });

      expect(mockOnProfileUpdate).toHaveBeenCalledWith({
        primarySoftware: 'Other',
        customSoftware: 'Houdini',
      });
    });

    it('should display selected software with active styling', async () => {
      const modellerProfile: ModellerProfile = {
        primarySoftware: 'Blender',
      };

      render(
        <UserPathSelector
          selectedPath="modeller"
          modellerProfile={modellerProfile}
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        const blenderButton = screen.getByLabelText('Select Blender as primary software');
        expect(blenderButton).toHaveClass('border-cyan-500');
        expect(blenderButton).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });

  describe('Buyer Fields', () => {
    it('should show Buyer fields when Buyer path is selected', async () => {
      render(
        <UserPathSelector
          selectedPath="buyer"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Buyer Interests')).toBeInTheDocument();
      });

      expect(screen.getByText('Select your interests')).toBeInTheDocument();
    });

    it('should render all interest options', async () => {
      render(
        <UserPathSelector
          selectedPath="buyer"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Toggle Gaming interest')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Toggle Architecture interest')).toBeInTheDocument();
      expect(screen.getByLabelText('Toggle VR/AR interest')).toBeInTheDocument();
      expect(screen.getByLabelText('Toggle Film interest')).toBeInTheDocument();
      expect(screen.getByLabelText('Toggle Product Design interest')).toBeInTheDocument();
    });

    it('should call onProfileUpdate when interest is toggled on', async () => {
      render(
        <UserPathSelector
          selectedPath="buyer"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Toggle Gaming interest')).toBeInTheDocument();
      });

      const gamingButton = screen.getByLabelText('Toggle Gaming interest');
      fireEvent.click(gamingButton);

      expect(mockOnProfileUpdate).toHaveBeenCalledWith({
        interests: ['Gaming'],
      });
    });

    it('should call onProfileUpdate when interest is toggled off', async () => {
      const buyerProfile: BuyerProfile = {
        interests: ['Gaming', 'Film'],
      };

      render(
        <UserPathSelector
          selectedPath="buyer"
          buyerProfile={buyerProfile}
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Toggle Gaming interest')).toBeInTheDocument();
      });

      const gamingButton = screen.getByLabelText('Toggle Gaming interest');
      fireEvent.click(gamingButton);

      expect(mockOnProfileUpdate).toHaveBeenCalledWith({
        interests: ['Film'],
      });
    });

    it('should display selected interests with active styling', async () => {
      const buyerProfile: BuyerProfile = {
        interests: ['Gaming', 'Architecture'],
      };

      render(
        <UserPathSelector
          selectedPath="buyer"
          buyerProfile={buyerProfile}
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        const gamingButton = screen.getByLabelText('Toggle Gaming interest');
        expect(gamingButton).toHaveClass('border-purple-500');
        expect(gamingButton).toHaveAttribute('aria-pressed', 'true');

        const architectureButton = screen.getByLabelText('Toggle Architecture interest');
        expect(architectureButton).toHaveClass('border-purple-500');
        expect(architectureButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('should display interest count when interests are selected', async () => {
      const buyerProfile: BuyerProfile = {
        interests: ['Gaming', 'Film', 'VR/AR'],
      };

      render(
        <UserPathSelector
          selectedPath="buyer"
          buyerProfile={buyerProfile}
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('3 interests selected')).toBeInTheDocument();
      });
    });

    it('should display singular "interest" when only one is selected', async () => {
      const buyerProfile: BuyerProfile = {
        interests: ['Gaming'],
      };

      render(
        <UserPathSelector
          selectedPath="buyer"
          buyerProfile={buyerProfile}
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('1 interest selected')).toBeInTheDocument();
      });
    });
  });

  describe('Field Visibility', () => {
    it('should not show additional fields when no path is selected', () => {
      render(
        <UserPathSelector
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      expect(screen.queryByText('Modeller Details')).not.toBeInTheDocument();
      expect(screen.queryByText('Buyer Interests')).not.toBeInTheDocument();
    });

    it('should hide Buyer fields when Modeller is selected', async () => {
      render(
        <UserPathSelector
          selectedPath="modeller"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Modeller Details')).toBeInTheDocument();
      });

      expect(screen.queryByText('Buyer Interests')).not.toBeInTheDocument();
    });

    it('should hide Modeller fields when Buyer is selected', async () => {
      render(
        <UserPathSelector
          selectedPath="buyer"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Buyer Interests')).toBeInTheDocument();
      });

      expect(screen.queryByText('Modeller Details')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-pressed attributes on path cards', () => {
      render(
        <UserPathSelector
          selectedPath="modeller"
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      const modellerCard = screen.getByLabelText('Select Modeller path');
      const buyerCard = screen.getByLabelText('Select Buyer path');

      expect(modellerCard).toHaveAttribute('aria-pressed', 'true');
      expect(buyerCard).toHaveAttribute('aria-pressed', 'false');
    });

    it('should have proper aria-pressed attributes on software buttons', async () => {
      const modellerProfile: ModellerProfile = {
        primarySoftware: 'Maya',
      };

      render(
        <UserPathSelector
          selectedPath="modeller"
          modellerProfile={modellerProfile}
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        const mayaButton = screen.getByLabelText('Select Maya as primary software');
        expect(mayaButton).toHaveAttribute('aria-pressed', 'true');

        const blenderButton = screen.getByLabelText('Select Blender as primary software');
        expect(blenderButton).toHaveAttribute('aria-pressed', 'false');
      });
    });

    it('should have proper aria-pressed attributes on interest buttons', async () => {
      const buyerProfile: BuyerProfile = {
        interests: ['Gaming'],
      };

      render(
        <UserPathSelector
          selectedPath="buyer"
          buyerProfile={buyerProfile}
          onSelect={mockOnSelect}
          onProfileUpdate={mockOnProfileUpdate}
        />
      );

      await waitFor(() => {
        const gamingButton = screen.getByLabelText('Toggle Gaming interest');
        expect(gamingButton).toHaveAttribute('aria-pressed', 'true');

        const filmButton = screen.getByLabelText('Toggle Film interest');
        expect(filmButton).toHaveAttribute('aria-pressed', 'false');
      });
    });
  });
});
