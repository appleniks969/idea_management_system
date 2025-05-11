import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommentsByIdeaId, addComment } from '../services/commentService';
import { Comment, CommentType } from '../types';
import { ApiError } from '../services/api';

// Query keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (filters: string) => [...commentKeys.lists(), { filters }] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
};

// Hook for fetching comments for an idea
export function useCommentsByIdeaId(ideaId: string) {
  return useQuery({
    queryKey: commentKeys.list(ideaId),
    queryFn: async () => {
      const response = await getCommentsByIdeaId(ideaId);
      return response.data;
    },
    enabled: Boolean(ideaId), // Only run the query if an ideaId is provided
  });
}

// Hook for adding a new comment
export function useAddComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentData: Omit<Comment, 'id' | 'commentDate'>) => {
      const response = await addComment(commentData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the comments list for this idea to trigger a refetch
      queryClient.invalidateQueries({ queryKey: commentKeys.list(data.ideaId) });
    },
    onError: (error: ApiError) => {
      console.error('Error adding comment:', error);
      throw error;
    },
  });
}