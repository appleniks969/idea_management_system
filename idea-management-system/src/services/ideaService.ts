import { Idea, IdeaStatus } from '../types';
import { mockIdeas } from '../mockData';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse, createApiResponse, handleApiError } from './api';

/**
 * Submit a new idea
 */
export const submitIdea = async (
  ideaData: Omit<Idea, 'id' | 'status' | 'dateSubmitted' | 'lastModified'>
): Promise<ApiResponse<Idea>> => {
  try {
    // In a real app, this would be an API call
    const newIdea: Idea = {
      ...ideaData,
      id: uuidv4(),
      status: IdeaStatus.SUBMITTED,
      dateSubmitted: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    // In a real app, this would add to a database
    mockIdeas.unshift(newIdea);

    return createApiResponse(newIdea, 201, 'Idea created successfully');
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get an idea by ID
 */
export const getIdeaById = async (id: string): Promise<ApiResponse<Idea | null>> => {
  try {
    // In a real app, this would be an API call
    const idea = mockIdeas.find((idea) => idea.id === id) || null;

    if (!idea) {
      return createApiResponse(null, 404, 'Idea not found');
    }

    return createApiResponse(idea);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all ideas
 */
export const getAllIdeas = async (): Promise<ApiResponse<Idea[]>> => {
  try {
    // In a real app, this would be an API call
    return createApiResponse([...mockIdeas]);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get ideas by status
 */
export const getIdeasByStatus = async (status: IdeaStatus): Promise<ApiResponse<Idea[]>> => {
  try {
    const filteredIdeas = mockIdeas.filter(idea => idea.status === status);
    return createApiResponse(filteredIdeas);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update an existing idea
 */
export const updateIdea = async (id: string, ideaData: Partial<Idea>): Promise<ApiResponse<Idea>> => {
  try {
    // In a real app, this would be an API call
    const ideaIndex = mockIdeas.findIndex((idea) => idea.id === id);

    if (ideaIndex === -1) {
      return createApiResponse({} as Idea, 404, 'Idea not found');
    }

    const updatedIdea: Idea = {
      ...mockIdeas[ideaIndex],
      ...ideaData,
      lastModified: new Date().toISOString(),
    };

    // In a real app, this would update a database
    mockIdeas[ideaIndex] = updatedIdea;

    return createApiResponse(updatedIdea, 200, 'Idea updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
};