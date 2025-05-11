import { Comment, CommentType } from '../types';

// Mock comments data
export const mockComments: Comment[] = [
  {
    id: 'comment1',
    ideaId: 'idea1',
    userId: 'approver1',
    commentText: 'This is an excellent idea that aligns with our digital transformation strategy.',
    commentDate: '2025-05-01T14:30:00Z',
    commentType: CommentType.GENERAL
  },
  {
    id: 'comment2',
    ideaId: 'idea3',
    userId: 'approver4',
    commentText: 'Please provide more details on how this would be implemented across different teams with varying work requirements.',
    commentDate: '2025-04-28T09:15:00Z',
    commentType: CommentType.REVISION_REQUEST
  },
  {
    id: 'comment3',
    ideaId: 'idea5',
    userId: 'approver3',
    commentText: 'This proposal lacks a detailed cost-benefit analysis. Our current cloud infrastructure is optimized based on a company-wide assessment conducted last quarter.',
    commentDate: '2025-04-15T11:45:00Z',
    commentType: CommentType.REJECTION_REASON
  },
  {
    id: 'comment4',
    ideaId: 'idea6',
    userId: 'approver2',
    commentText: 'Great idea! This would give us valuable insights directly from our users. Approved.',
    commentDate: '2025-05-03T16:20:00Z',
    commentType: CommentType.GENERAL
  },
  {
    id: 'comment5',
    ideaId: 'idea9',
    userId: 'approver8',
    commentText: 'This aligns with our risk management goals. Please work with the IT team to implement.',
    commentDate: '2025-04-22T10:30:00Z',
    commentType: CommentType.GENERAL
  },
  {
    id: 'comment6',
    ideaId: 'idea11',
    userId: 'approver6',
    commentText: 'The proposal is promising but needs more specific metrics on expected performance improvements. Please add benchmarks and targets.',
    commentDate: '2025-05-05T13:45:00Z',
    commentType: CommentType.REVISION_REQUEST
  },
  {
    id: 'comment7',
    ideaId: 'idea2',
    userId: 'approver10',
    commentText: 'I like this initiative. Have you researched suppliers for the sustainable alternatives?',
    commentDate: '2025-05-06T09:10:00Z',
    commentType: CommentType.GENERAL
  },
  {
    id: 'comment8',
    ideaId: 'idea7',
    userId: 'approver5',
    commentText: 'This would definitely streamline our processes. Please coordinate with the finance team for implementation details.',
    commentDate: '2025-05-02T15:30:00Z',
    commentType: CommentType.GENERAL
  },
  {
    id: 'comment9',
    ideaId: 'idea10',
    userId: 'approver4',
    commentText: 'This could be valuable for building bridges between teams. Looking into how we can pilot this.',
    commentDate: '2025-05-04T11:20:00Z',
    commentType: CommentType.GENERAL
  }
];

// Function to get comments for a specific idea
export const getCommentsForIdea = (ideaId: string): Comment[] => {
  return mockComments.filter(comment => comment.ideaId === ideaId);
};