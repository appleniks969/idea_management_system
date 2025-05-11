import { Comment, CommentType } from '../types';
import { mockComments } from '../mockData';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse, createApiResponse, handleApiError } from './api';

// Get comments for an idea
export const getCommentsByIdeaId = async (ideaId: string): Promise<ApiResponse<Comment[]>> => {
  try {
    const comments = mockComments.filter(comment => comment.ideaId === ideaId);
    return createApiResponse(comments);
  } catch (error) {
    return handleApiError(error);
  }
};

// Add a new comment
export const addComment = async (commentData: Omit<Comment, 'id' | 'commentDate'>): Promise<ApiResponse<Comment>> => {
  try {
    const newComment: Comment = {
      ...commentData,
      id: uuidv4(),
      commentDate: new Date().toISOString(),
    };
    
    // In a real app, this would add to a database
    mockComments.push(newComment);
    
    return createApiResponse(newComment, 201, 'Comment added successfully');
  } catch (error) {
    return handleApiError(error);
  }
};