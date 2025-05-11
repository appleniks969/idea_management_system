import type { AuditLog } from '../types';

// Mock audit logs data
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log1',
    action: 'IDEA_SUBMITTED',
    timestamp: '2025-04-10T10:23:15Z',
    userId: 'user1',
    details: 'Idea ID: idea1 - Implement company-wide knowledge sharing platform'
  },
  {
    id: 'log2',
    action: 'IDEA_ASSIGNED',
    timestamp: '2025-04-10T11:05:30Z',
    userId: 'system',
    details: 'Idea ID: idea1 assigned to Approver ID: approver1'
  },
  {
    id: 'log3',
    action: 'IDEA_APPROVED',
    timestamp: '2025-04-12T14:30:45Z',
    userId: 'approver1',
    details: 'Idea ID: idea1 approved'
  },
  {
    id: 'log4',
    action: 'IDEA_SUBMITTED',
    timestamp: '2025-04-13T09:45:10Z',
    userId: 'user2',
    details: 'Idea ID: idea2 - Reduce plastic usage in office supplies'
  },
  {
    id: 'log5',
    action: 'IDEA_ASSIGNED',
    timestamp: '2025-04-13T10:15:22Z',
    userId: 'system',
    details: 'Idea ID: idea2 assigned to Approver ID: approver10'
  },
  {
    id: 'log6',
    action: 'IDEA_COMMENT_ADDED',
    timestamp: '2025-04-13T15:30:18Z',
    userId: 'approver10',
    details: 'Comment added to Idea ID: idea2'
  },
  {
    id: 'log7',
    action: 'IDEA_SUBMITTED',
    timestamp: '2025-04-15T11:20:05Z',
    userId: 'user3',
    details: 'Idea ID: idea3 - Implement four-day work week pilot program'
  },
  {
    id: 'log8',
    action: 'IDEA_ASSIGNED',
    timestamp: '2025-04-15T12:10:30Z',
    userId: 'system',
    details: 'Idea ID: idea3 assigned to Approver ID: approver4'
  },
  {
    id: 'log9',
    action: 'IDEA_REVISION_REQUESTED',
    timestamp: '2025-04-16T09:45:12Z',
    userId: 'approver4',
    details: 'Revision requested for Idea ID: idea3'
  },
  {
    id: 'log10',
    action: 'IDEA_SUBMITTED',
    timestamp: '2025-04-18T14:30:55Z',
    userId: 'user4',
    details: 'Idea ID: idea5 - Optimize cloud infrastructure costs'
  },
  {
    id: 'log11',
    action: 'IDEA_ASSIGNED',
    timestamp: '2025-04-18T15:05:10Z',
    userId: 'system',
    details: 'Idea ID: idea5 assigned to Approver ID: approver3'
  },
  {
    id: 'log12',
    action: 'IDEA_REJECTED',
    timestamp: '2025-04-19T10:15:22Z',
    userId: 'approver3',
    details: 'Idea ID: idea5 rejected'
  }
];

// Function to get audit logs for a specific idea
export const getAuditLogsForIdea = (ideaId: string): AuditLog[] => {
  return mockAuditLogs.filter(log => log.details.includes(`Idea ID: ${ideaId}`));
};