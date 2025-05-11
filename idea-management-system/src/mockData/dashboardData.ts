import {
  DashboardMetrics,
  IdeaStatus,
  ImpactLevel,
  EffortLevel,
  ImplementationPhase,
  Idea
} from '../types';
import { mockIdeas } from './ideas';
import { departments } from './users';
import { categories } from './users';

// Generate dashboard metrics from the mock ideas
export const getDashboardMetrics = (): DashboardMetrics => {
  // Count total ideas
  const totalIdeas = mockIdeas.length;
  
  // Count ideas by status
  const byStatus = Object.values(IdeaStatus).reduce((acc, status) => {
    acc[status] = mockIdeas.filter(idea => idea.status === status).length;
    return acc;
  }, {} as Record<IdeaStatus, number>);
  
  // For mock data, we'll simulate department counts
  // In a real app, this would be calculated based on the submitter's department
  const byDepartment = departments.reduce((acc, dept) => {
    // Generate more visible data for better chart display
    acc[dept] = Math.floor(Math.random() * 8) + 2; // 2-9 ideas per department
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalIdeas,
    byStatus,
    byDepartment
  };
};

// Data for the status distribution chart
export const getStatusDistributionData = () => {
  const metrics = getDashboardMetrics();
  
  return Object.entries(metrics.byStatus).map(([status, count]) => ({
    name: status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
    value: count
  }));
};

// Data for the department distribution chart
export const getDepartmentDistributionData = () => {
  const metrics = getDashboardMetrics();

  // Sort data to display in descending order for better visualization
  return Object.entries(metrics.byDepartment)
    .map(([department, count]) => ({
      name: department,
      value: count
    }))
    .sort((a, b) => b.value - a.value);
};

// Data for the idea submission timeline chart (last 6 months)
export const getIdeaSubmissionTimelineData = () => {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(month.toLocaleString('default', { month: 'short' }));
  }

  // Use consistent submission values that follow a reasonable trend
  const counts = [18, 24, 15, 22, 27, 12];

  return months.map((month, index) => ({
    name: month,
    count: counts[index] // Use predefined counts for a nicer visual
  }));
};

// Data for Impact vs Effort matrix visualization
export const getImpactVsEffortData = () => {
  return mockIdeas.map(idea => {
    // Convert enum string values to numeric values for the scatter plot
    const impactValue = idea.impact ? getImpactNumericValue(idea.impact) : 0;
    const effortValue = idea.effort ? getEffortNumericValue(idea.effort) : 0;

    return {
      id: idea.id,
      title: idea.title,
      x: effortValue, // Effort on X-axis
      y: impactValue, // Impact on Y-axis
      status: idea.status,
      category: idea.category,
      roi: idea.expectedROI
    };
  });
};

// Convert impact enum to numeric value for plotting
const getImpactNumericValue = (impact: ImpactLevel): number => {
  switch (impact) {
    case ImpactLevel.LOW:
      return 1;
    case ImpactLevel.MEDIUM:
      return 2;
    case ImpactLevel.HIGH:
      return 3;
    case ImpactLevel.VERY_HIGH:
      return 4;
    default:
      return 0;
  }
};

// Convert effort enum to numeric value for plotting
const getEffortNumericValue = (effort: EffortLevel): number => {
  switch (effort) {
    case EffortLevel.LOW:
      return 1;
    case EffortLevel.MEDIUM:
      return 2;
    case EffortLevel.HIGH:
      return 3;
    case EffortLevel.VERY_HIGH:
      return 4;
    default:
      return 0;
  }
};

// Data for category approval rate
export const getCategoryApprovalRateData = () => {
  const categoryData = categories.map(category => {
    const ideasInCategory = mockIdeas.filter(idea => idea.category === category);
    const approvedIdeas = ideasInCategory.filter(idea => idea.status === IdeaStatus.APPROVED);

    const approvalRate = ideasInCategory.length > 0
      ? (approvedIdeas.length / ideasInCategory.length) * 100
      : 0;

    return {
      name: category,
      approvalRate: Math.round(approvalRate),
      totalIdeas: ideasInCategory.length,
      approvedIdeas: approvedIdeas.length
    };
  });

  // Sort by approval rate descending
  return categoryData.sort((a, b) => b.approvalRate - a.approvalRate);
};

// Data for implementation timeline visualization
export const getImplementationTimelineData = () => {
  // Filter to only approved ideas with implementation data
  const implementingIdeas = mockIdeas.filter(idea =>
    idea.status === IdeaStatus.APPROVED &&
    idea.implementationPhase &&
    idea.implementationStartDate
  );

  return implementingIdeas.map(idea => {
    // Calculate progress percentage based on implementation phase
    let progressPercentage = 0;

    switch (idea.implementationPhase) {
      case ImplementationPhase.PLANNING:
        progressPercentage = 15;
        break;
      case ImplementationPhase.IN_PROGRESS:
        progressPercentage = 50;
        break;
      case ImplementationPhase.TESTING:
        progressPercentage = 85;
        break;
      case ImplementationPhase.COMPLETED:
        progressPercentage = 100;
        break;
      default:
        progressPercentage = 0;
    }

    return {
      id: idea.id,
      title: idea.title,
      startDate: idea.implementationStartDate,
      estimatedEndDate: idea.estimatedCompletionDate,
      actualEndDate: idea.actualCompletionDate,
      phase: idea.implementationPhase,
      progress: progressPercentage,
      category: idea.category
    };
  });
};