import { Idea, IdeaStatus } from '../types';
import { mockIdeas } from '../mockData';
import { v4 as uuidv4 } from 'uuid';

/**
 * Submit a new idea
 */
export const submitIdea = async (ideaData: Omit<Idea, 'id' | 'status' | 'dateSubmitted' | 'lastModified'>): Promise<Idea> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const newIdea: Idea = {
        ...ideaData,
        id: uuidv4(),
        status: IdeaStatus.SUBMITTED,
        dateSubmitted: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
      
      // In a real app, this would add to a database
      mockIdeas.unshift(newIdea);
      
      resolve(newIdea);
    }, 500);
  });
};

/**
 * Get an idea by ID
 */
export const getIdeaById = async (id: string): Promise<Idea | null> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const idea = mockIdeas.find((idea) => idea.id === id) || null;
      resolve(idea);
    }, 300);
  });
};

/**
 * Get all ideas
 */
export const getAllIdeas = async (): Promise<Idea[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve([...mockIdeas]);
    }, 300);
  });
};

/**
 * Update an existing idea
 */
export const updateIdea = async (id: string, ideaData: Partial<Idea>): Promise<Idea | null> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const ideaIndex = mockIdeas.findIndex((idea) => idea.id === id);
      if (ideaIndex === -1) {
        resolve(null);
        return;
      }
      
      const updatedIdea: Idea = {
        ...mockIdeas[ideaIndex],
        ...ideaData,
        lastModified: new Date().toISOString(),
      };
      
      // In a real app, this would update a database
      mockIdeas[ideaIndex] = updatedIdea;
      
      resolve(updatedIdea);
    }, 500);
  });
};