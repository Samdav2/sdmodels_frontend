import { useState, useEffect } from 'react';

export function useAdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await api.admin.getTestimonials();
        
        // Mock data for now
        setTestimonials([
          { id: 1, author: "John Doe", company: "GameStudio Inc", text: "Amazing quality models!", rating: 5, verified: true, featured: true },
          { id: 2, author: "Jane Smith", company: "VR Innovations", text: "Best marketplace for 3D assets", rating: 5, verified: true, featured: false },
          { id: 3, author: "Mike Johnson", company: "Indie Games", text: "Great platform and support", rating: 4, verified: false, featured: false },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const toggleFeatured = async (id: number) => {
    try {
      // TODO: Call API
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, featured: !t.featured } : t));
    } catch (err: any) {
      setError(err.message || 'Failed to toggle featured');
    }
  };

  const deleteTestimonial = async (id: number) => {
    try {
      // TODO: Call API
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete testimonial');
    }
  };

  return { testimonials, loading, error, toggleFeatured, deleteTestimonial };
}
