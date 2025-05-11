// User roles
export enum UserRole {
  SUBMITTER = 'submitter',
  APPROVER = 'approver',
  ADMINISTRATOR = 'administrator'
}

// Status of ideas
export enum IdeaStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REVISION_REQUESTED = 'revision_requested',
  REJECTED = 'rejected'
}

// Comment types
export enum CommentType {
  GENERAL = 'general',
  REVISION_REQUEST = 'revision_request',
  REJECTION_REASON = 'rejection_reason'
}

// User interface
export interface User {
  id: string;
  username: string;
  passwordHash?: string; // Not used in frontend except for mock auth
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  approvalCategories?: string[]; // For approvers only
  isActive: boolean;
}

// Implementation phase
export enum ImplementationPhase {
  NOT_STARTED = 'not_started',
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  COMPLETED = 'completed'
}

// Impact level
export enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

// Effort level
export enum EffortLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

// Idea interface
export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  benefits: string;
  submitterId: string;
  status: IdeaStatus;
  dateSubmitted: string;
  lastModified: string;
  assignedApproverId?: string;
  attachments?: string[]; // URLs or file references

  // New fields for enhanced visualizations
  impact?: ImpactLevel;
  effort?: EffortLevel;
  implementationPhase?: ImplementationPhase;
  implementationStartDate?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  expectedROI?: number; // Percentage or dollar amount
}

// Comment interface
export interface Comment {
  id: string;
  ideaId: string;
  userId: string;
  commentText: string;
  commentDate: string;
  commentType: CommentType;
}

// Audit log entry interface
export interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  userId: string;
  details: string;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalIdeas: number;
  byStatus: {
    [key in IdeaStatus]: number;
  };
  byDepartment: {
    [department: string]: number;
  };
}