import { useQuery } from '@tanstack/react-query';
import { getUserById, getAllUsers } from '../services/userService';
import { User } from '../types';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook for fetching a single user by ID
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await getUserById(id);
      return response.data;
    },
    enabled: Boolean(id), // Only run the query if an ID is provided
  });
}

// Hook for fetching all users
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const response = await getAllUsers();
      return response.data;
    },
  });
}