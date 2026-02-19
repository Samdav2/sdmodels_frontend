import { useState, useEffect } from 'react';
import { adminApi } from '../admin';

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
      const data = await adminApi.getContent();
      setPosts(data.items || data || []);
    } catch (err: any) {
      console.error('Failed to fetch content:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch content posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const publishPost = async (title: string, content: string) => {
    try {
      await adminApi.publishContent(title, content);
      await fetchPosts();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to publish post');
      throw err;
    }
  };

  const deletePost = async (postId: number) => {
    try {
      await adminApi.deleteContent(postId);
      await fetchPosts();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete post');
      throw err;
    }
  };

  return { posts, loading, error, publishPost, deletePost, refetch: fetchPosts };
}
