import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communitiesApi } from '../communities';

// Get community with auto-refresh every 10 seconds
export function useCommunityQuery(id: string) {
  return useQuery({
    queryKey: ['community', id],
    queryFn: () => communitiesApi.getCommunity(id),
    refetchInterval: 10000, // Auto-refresh every 10 seconds
    enabled: !!id,
  });
}

// Get posts with auto-refresh every 10 seconds
export function useCommunityPostsQuery(communityId: string, filter = 'recent') {
  return useQuery({
    queryKey: ['community-posts', communityId, filter],
    queryFn: async () => {
      const data = await communitiesApi.getPosts(communityId, filter);
      const response = data as any;
      const postsArray = response.posts || response.items || [];
      // Parse reactions if it's a string
      return postsArray.map((post: any) => ({
        ...post,
        reactions: typeof post.reactions === 'string' 
          ? JSON.parse(post.reactions) 
          : (post.reactions || { like: 0, love: 0, wow: 0, fire: 0 })
      }));
    },
    refetchInterval: 10000, // Auto-refresh every 10 seconds
    enabled: !!communityId,
  });
}

// Get comments with auto-refresh every 15 seconds (only when enabled)
export function useCommentsQuery(postId: string, enabled = false) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await communitiesApi.getComments(postId);
      const data = response as any;
      return data.comments || data.items || [];
    },
    refetchInterval: enabled ? 15000 : false, // Only poll when comments are visible
    enabled: enabled && !!postId,
  });
}

// Create post mutation with automatic cache update
export function useCreatePostMutation(communityId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { content: string; image_url?: string; model_url?: string }) =>
      communitiesApi.createPost(communityId, data),
    onSuccess: () => {
      // Invalidate and refetch posts to show new post
      queryClient.invalidateQueries({ queryKey: ['community-posts', communityId] });
      // Also invalidate community to update post count
      queryClient.invalidateQueries({ queryKey: ['community', communityId] });
    },
  });
}

// React to post mutation with optimistic update
export function useReactToPostMutation(communityId: string, filter: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, reaction }: { postId: string; reaction: string }) =>
      communitiesApi.reactToPost(postId, reaction),
    onMutate: async ({ postId, reaction }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['community-posts', communityId, filter] });
      
      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(['community-posts', communityId, filter]);
      
      // Optimistically update
      queryClient.setQueryData(['community-posts', communityId, filter], (old: any) => {
        if (!old) return old;
        return old.map((post: any) => {
          if (post.id === postId) {
            const reactions = { ...post.reactions };
            reactions[reaction] = (reactions[reaction] || 0) + 1;
            return { ...post, reactions, userReaction: reaction };
          }
          return post;
        });
      });
      
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['community-posts', communityId, filter], context.previousPosts);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['community-posts', communityId, filter] });
    },
  });
}

// Add comment mutation with automatic cache update
export function useAddCommentMutation(postId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ content, parentId }: { content: string; parentId?: string }) =>
      communitiesApi.addComment(postId, content, parentId),
    onSuccess: () => {
      // Invalidate comments to show new comment
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}

// Like comment mutation
export function useLikeCommentMutation(postId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, unlike }: { commentId: string; unlike: boolean }) =>
      unlike 
        ? communitiesApi.unlikeComment(commentId)
        : communitiesApi.likeComment(commentId),
    onSuccess: () => {
      // Invalidate comments to show updated like count
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}

// Join/Leave community mutation
export function useJoinCommunityMutation(communityId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ leave }: { leave: boolean }) =>
      leave 
        ? communitiesApi.leaveCommunity(communityId)
        : communitiesApi.joinCommunity(communityId),
    onSuccess: () => {
      // Invalidate community to update member count and join status
      queryClient.invalidateQueries({ queryKey: ['community', communityId] });
    },
  });
}
