import { useState, useEffect } from 'react';
import { api } from '../index';
import { BlogPost } from '../types';

interface UseBlogPostsOptions {
  category?: string;
  limit?: number;
  page?: number;
  search?: string;
}

export function useBlogPosts(options: UseBlogPostsOptions = {}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.blog.getPosts(options);
        setPosts(data.items || []);
        setTotal(data.total || 0);
        setPages(data.pages || 0);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blog posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [JSON.stringify(options)]);

  return { posts, loading, error, total, pages };
}
