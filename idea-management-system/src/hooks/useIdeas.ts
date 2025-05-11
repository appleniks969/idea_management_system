import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllIdeas, 
  getIdeaById, 
  submitIdea, 
  updateIdea, 
  getIdeasByStatus 
} from '../services/ideaService';
import { Idea, IdeaStatus } from '../types';
import { ApiError } from '../services/api';

// Query keys
export const ideaKeys = {
  all: ['ideas'] as const,
  lists: () => [...ideaKeys.all, 'list'] as const,
  list: (filters: string) => [...ideaKeys.lists(), { filters }] as const,
  details: () => [...ideaKeys.all, 'detail'] as const,
  detail: (id: string) => [...ideaKeys.details(), id] as const,
};

// Hook for fetching all ideas
export function useIdeas() {
  return useQuery({
    queryKey: ideaKeys.lists(),
    queryFn: async () => {
      const response = await getAllIdeas();
      return response.data;
    },
  });
}

// Hook for fetching ideas filtered by status
export function useIdeasByStatus(status: IdeaStatus) {
  return useQuery({
    queryKey: ideaKeys.list(status),
    queryFn: async () => {
      const response = await getIdeasByStatus(status);
      return response.data;
    },
  });
}

// Hook for fetching a single idea by ID
export function useIdea(id: string) {
  return useQuery({
    queryKey: ideaKeys.detail(id),
    queryFn: async () => {
      const response = await getIdeaById(id);
      if (response.status === 404) {
        throw new Error('Idea not found');
      }
      return response.data;
    },
    enabled: Boolean(id), // Only run the query if an ID is provided
  });
}

// Hook for submitting a new idea
export function useSubmitIdea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ideaData: Omit<Idea, 'id' | 'status' | 'dateSubmitted' | 'lastModified'>) => {
      const response = await submitIdea(ideaData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the ideas list query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
    },
    onError: (error: ApiError) => {
      console.error('Error submitting idea:', error);
      throw error;
    },
  });
}

// Hook for updating an existing idea
export function useUpdateIdea() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Idea> }) => {
      const response = await updateIdea(id, data);
      if (response.status === 404) {
        throw new Error('Idea not found');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the cache for the specific idea
      queryClient.setQueryData(ideaKeys.detail(variables.id), data);
      
      // Also invalidate the lists that might contain this idea
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
    },
    onError: (error: ApiError) => {
      console.error('Error updating idea:', error);
      throw error;
    },
  });
}