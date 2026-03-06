import { useState, useEffect } from 'react';
import { communitiesApi, CommunityFilters } from '../communities';
import { Community } from '../types';

export function useCommunities(filters: CommunityFilters = {}) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await communitiesApi.getCommunities(filters);
        // Backend returns { communities: [...], total, page, limit }
        const response = data as any;
        setCommunities(response.communities || response.items || []);
        setTotal(response.total || 0);
        setPages(response.pages || 0);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch communities');
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [JSON.stringify(filters)]);

  return { communities, loading, error, total, pages };
}

export function useCommunity(id: string) {
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await communitiesApi.getCommunity(id);
      setCommunity(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch community');
      setCommunity(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCommunity();
    }
  }, [id]);

  return { community, loading, error, refetch: fetchCommunity };
}

export function useCommunityPosts(communityId: string, filter = 'recent') {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await communitiesApi.getPosts(communityId, filter);
      // Backend returns { posts: [...], page, limit } not { items: [...] }
      const response = data as any;
      const postsArray = response.posts || response.items || [];
      // Parse reactions if it's a string
      const parsedPosts = postsArray.map((post: any) => ({
        ...post,
        reactions: typeof post.reactions === 'string' 
          ? JSON.parse(post.reactions) 
          : (post.reactions || { like: 0, love: 0, wow: 0, fire: 0 })
      }));
      setPosts(parsedPosts);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchPosts();
    }
  }, [communityId, filter]);

  const createPost = async (content: string, imageUrl?: string, modelUrl?: string) => {
    try {
      const newPost = await communitiesApi.createPost(communityId, {
        content,
        image_url: imageUrl,
        model_url: modelUrl, // Now passing the actual file URL, not ID
      });
      setPosts([newPost, ...posts]);
      return newPost;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Failed to create post');
    }
  };

  const reactToPost = async (postId: number, reactionType: string) => {
    try {
      await communitiesApi.reactToPost(postId, reactionType);
      // Update local state
      setPosts(posts.map(p => {
        if (p.id === postId) {
          const reactions = { ...p.reactions };
          reactions[reactionType] = (reactions[reactionType] || 0) + 1;
          return { ...p, reactions };
        }
        return p;
      }));
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Failed to react to post');
    }
  };

  return { posts, loading, error, createPost, reactToPost, refetch: fetchPosts };
}
