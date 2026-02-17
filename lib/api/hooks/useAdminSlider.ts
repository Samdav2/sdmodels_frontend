import { useState, useEffect } from 'react';

export function useAdminSlider() {
  const [sliderSlots, setSliderSlots] = useState<any[]>([]);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await api.admin.getSliderSettings();
        
        // Mock data for now
        setSliderSlots([
          { id: 1, model: { name: "Cyberpunk Mech Warrior", author: "PixelForge", image: "🤖" } },
          { id: 2, model: { name: "Sci-Fi Vehicle", author: "3D_Wizard", image: "🚗" } },
          { id: 3, model: { name: "Dragon Animated", author: "MeshMaster", image: "🐉" } },
        ]);
        
        setAvailableModels([
          { id: 4, name: "Fantasy Castle", author: "PolyPro", image: "🏰", views: 2340 },
          { id: 5, name: "Space Station", author: "VoxelVerse", image: "🚀", views: 1890 },
          { id: 6, name: "Robot Companion", author: "PixelForge", image: "🤖", views: 3120 },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch slider settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSlider();
  }, []);

  const updateSlider = async (slots: any[]) => {
    try {
      // TODO: Call API
      setSliderSlots(slots);
    } catch (err: any) {
      setError(err.message || 'Failed to update slider');
    }
  };

  return { sliderSlots, availableModels, loading, error, updateSlider, setSliderSlots };
}
