import { User } from '../types';
import { mockUsers } from '../mockData';
import { ApiResponse, createApiResponse, handleApiError } from './api';

// Get user by ID
export const getUserById = async (userId: string): Promise<ApiResponse<User | null>> => {
  try {
    const user = mockUsers.find(user => user.id === userId) || null;
    
    if (!user) {
      return createApiResponse(null, 404, 'User not found');
    }
    
    return createApiResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all users
export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    return createApiResponse([...mockUsers]);
  } catch (error) {
    return handleApiError(error);
  }
};