import { useState, useEffect } from 'react';
import { api } from '../index';
import { BlogPost } from '../types';

export function useBlogPost(id: string | number) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.blog.getPost(Number(id));
        setPost(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blog post');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  return { post, loading, error };
}
