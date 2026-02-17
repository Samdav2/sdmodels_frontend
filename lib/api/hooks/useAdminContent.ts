import { useState, useEffect } from 'react';

interface ContentPost {
  id: number;
  title: string;
  status: string;
  date: string;
  views: number;
}

export function useAdminContent() {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      // const response = await api.admin.getContentPosts();
      
      // Mock data for now
      setPosts([
        { id: 1, title: "Platform Update: New Features", status: "Published", date: "2024-02-15", views: 1234 },
        { id: 2, title: "Creator Spotlight: PixelForge", status: "Draft", date: "2024-02-16", views: 0 },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch content posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const publishPost = async (title: string, content: string) => {
    try {
      // TODO: Call API
      const newPost = {
        id: posts.length + 1,
        title,
        status: "Published",
        date: new Date().toISOString().split('T')[0],
        views: 0,
      };
      setPosts(prev => [newPost, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to publish post');
    }
  };

  const deletePost = async (postId: number) => {
    try {
      // TODO: Call API
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete post');
    }
  };

  return { posts, loading, error, publishPost, deletePost, refetch: fetchPosts };
}
