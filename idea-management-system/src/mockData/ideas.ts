import { Idea, IdeaStatus, ImpactLevel, EffortLevel, ImplementationPhase } from '../types';
import { getApproversForCategory } from './users';

// Generate a random date within the last 6 months
const getRandomRecentDate = () => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const randomTimestamp = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTimestamp).toISOString();
};

// Generate a random future date within the next 2-6 months
const getRandomFutureDate = () => {
  const now = new Date();
  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(now.getMonth() + 2);

  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(now.getMonth() + 6);

  const randomTimestamp = twoMonthsLater.getTime() + Math.random() * (sixMonthsLater.getTime() - twoMonthsLater.getTime());
  return new Date(randomTimestamp).toISOString();
};

// Generate random implementation start date (for approved ideas only)
const getRandomImplementationStartDate = (dateSubmitted: string, isApproved: boolean) => {
  if (!isApproved) return undefined;

  const submittedDate = new Date(dateSubmitted);
  const now = new Date();
  const maxStartDate = new Date();

  // Set max start date to 1 month from now
  maxStartDate.setMonth(now.getMonth() + 1);

  // Set start date between submission and max start date
  const randomTimestamp = submittedDate.getTime() + Math.random() * (maxStartDate.getTime() - submittedDate.getTime());
  return new Date(randomTimestamp).toISOString();
};

// Helper to get random enum value
const getRandomEnumValue = <T extends Record<string, string>>(enumObj: T): T[keyof T] => {
  const values = Object.values(enumObj);
  return values[Math.floor(Math.random() * values.length)] as T[keyof T];
};

// Generate random ROI percentage between 10% and 300%
const getRandomROI = (): number => {
  return Math.floor(Math.random() * 290) + 10;
};

// Mock ideas data
export const mockIdeas: Idea[] = [
  {
    id: 'idea1',
    title: 'Implement company-wide knowledge sharing platform',
    description: 'Create an internal platform where employees can share knowledge, articles, and best practices to foster a learning culture and reduce knowledge silos.',
    category: 'Technology Innovation',
    benefits: 'Improved knowledge sharing, reduced onboarding time, increased collaboration across departments.',
    submitterId: 'user1',
    status: IdeaStatus.APPROVED,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate(),
    assignedApproverId: 'approver1',
    impact: ImpactLevel.HIGH,
    effort: EffortLevel.MEDIUM,
    implementationPhase: ImplementationPhase.IN_PROGRESS,
    implementationStartDate: getRandomImplementationStartDate(getRandomRecentDate(), true),
    estimatedCompletionDate: getRandomFutureDate(),
    expectedROI: 125
  },
  {
    id: 'idea2',
    title: 'Reduce plastic usage in office supplies',
    description: 'Replace single-use plastic items in all offices with sustainable alternatives. This includes cups, cutlery, and packaging materials.',
    category: 'Sustainability',
    benefits: 'Environmental impact reduction, improved company image, potential cost savings in the long run.',
    submitterId: 'user2',
    status: IdeaStatus.UNDER_REVIEW,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate(),
    assignedApproverId: 'approver10'
  },
  {
    id: 'idea3',
    title: 'Implement four-day work week pilot program',
    description: 'Pilot a four-day work week in selected departments to evaluate impact on productivity, employee satisfaction, and work-life balance.',
    category: 'Employee Experience',
    benefits: 'Improved work-life balance, potential productivity increases, talent attraction and retention.',
    submitterId: 'user3',
    status: IdeaStatus.REVISION_REQUESTED,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate(),
    assignedApproverId: 'approver4'
  },
  {
    id: 'idea4',
    title: 'AI-powered customer support chatbot',
    description: 'Implement an AI chatbot for first-level customer support to handle common questions and issues, freeing up human agents for more complex problems.',
    category: 'Customer Experience',
    benefits: 'Faster response times, 24/7 support availability, reduced workload for support team, cost savings.',
    submitterId: 'user5',
    status: IdeaStatus.SUBMITTED,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate()
  },
  {
    id: 'idea5',
    title: 'Optimize cloud infrastructure costs',
    description: 'Review and optimize our cloud infrastructure to reduce costs by implementing auto-scaling, reserved instances, and removing unused resources.',
    category: 'Cost Saving',
    benefits: 'Significant reduction in monthly cloud expenses, improved resource utilization.',
    submitterId: 'user4',
    status: IdeaStatus.REJECTED,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate(),
    assignedApproverId: 'approver3'
  },
  {
    id: 'idea6',
    title: 'In-app feedback collection system',
    description: 'Create a non-intrusive in-app feedback system to collect user insights and improvement suggestions directly within our product.',
    category: 'Product Enhancement',
    benefits: 'Real-time user feedback, higher response rates, better user engagement and insights.',
    submitterId: 'user1',
    status: IdeaStatus.APPROVED,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate(),
    assignedApproverId: 'approver2'
  },
  {
    id: 'idea7',
    title: 'Streamline invoice approval process',
    description: 'Redesign the invoice approval workflow to reduce unnecessary steps and automate validation, decreasing processing time.',
    category: 'Process Improvement',
    benefits: 'Faster invoice processing, reduced administrative overhead, improved vendor relationships.',
    submitterId: 'user2',
    status: IdeaStatus.UNDER_REVIEW,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate(),
    assignedApproverId: 'approver5'
  },
  {
    id: 'idea8',
    title: 'Implement customer loyalty program',
    description: 'Design and implement a loyalty program that rewards repeat customers and encourages long-term relationships.',
    category: 'Revenue Generation',
    benefits: 'Increased customer retention, higher lifetime value, referral opportunities.',
    submitterId: 'user5',
    status: IdeaStatus.SUBMITTED,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate()
  },
  {
    id: 'idea9',
    title: 'Data backup and recovery enhancement',
    description: 'Improve our current data backup and disaster recovery systems to ensure business continuity and protect against data loss.',
    category: 'Risk Reduction',
    benefits: 'Improved data security, reduced risk of catastrophic data loss, regulatory compliance.',
    submitterId: 'user4',
    status: IdeaStatus.APPROVED,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate(),
    assignedApproverId: 'approver8'
  },
  {
    id: 'idea10',
    title: 'Cross-department mentorship program',
    description: 'Create a mentorship program that pairs employees from different departments to share knowledge and build stronger interdepartmental relationships.',
    category: 'Employee Experience',
    benefits: 'Knowledge transfer, improved company culture, career development opportunities.',
    submitterId: 'user3',
    status: IdeaStatus.UNDER_REVIEW,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate(),
    assignedApproverId: 'approver4'
  },
  {
    id: 'idea11',
    title: 'Mobile app performance optimization',
    description: 'Implement a comprehensive optimization of our mobile app to improve loading times, reduce battery usage, and enhance user experience.',
    category: 'Product Enhancement',
    benefits: 'Improved user experience, higher app ratings, reduced uninstall rate.',
    submitterId: 'user1',
    status: IdeaStatus.REVISION_REQUESTED,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate(),
    assignedApproverId: 'approver6'
  },
  {
    id: 'idea12',
    title: 'Automated regression testing system',
    description: 'Implement an automated testing framework to catch regression issues early in the development process.',
    category: 'Process Improvement',
    benefits: 'Faster release cycles, improved code quality, fewer production bugs.',
    submitterId: 'user1',
    status: IdeaStatus.SUBMITTED,
    dateSubmitted: getRandomRecentDate(),
    lastModified: getRandomRecentDate()
  }
];

// Enhance all mock ideas with additional metrics
mockIdeas.forEach((idea, index) => {
  if (index === 0) return; // Skip first item as we already enhanced it manually

  const isApproved = idea.status === IdeaStatus.APPROVED;
  const isRejected = idea.status === IdeaStatus.REJECTED;

  // Add impact and effort values for all ideas
  idea.impact = getRandomEnumValue(ImpactLevel);
  idea.effort = getRandomEnumValue(EffortLevel);

  // Only add implementation details for approved ideas
  if (isApproved) {
    // Randomly select a phase for approved ideas
    const phases = [
      ImplementationPhase.PLANNING,
      ImplementationPhase.IN_PROGRESS,
      ImplementationPhase.TESTING,
      ImplementationPhase.COMPLETED
    ];
    idea.implementationPhase = phases[Math.floor(Math.random() * phases.length)];

    // Add implementation dates
    idea.implementationStartDate = getRandomImplementationStartDate(idea.dateSubmitted, true);
    idea.estimatedCompletionDate = getRandomFutureDate();

    // Add completed date for completed projects
    if (idea.implementationPhase === ImplementationPhase.COMPLETED) {
      const startDate = new Date(idea.implementationStartDate!);
      const now = new Date();
      const randomCompletionTimestamp = startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime());
      idea.actualCompletionDate = new Date(randomCompletionTimestamp).toISOString();
    }

    // Add ROI for approved ideas
    idea.expectedROI = getRandomROI();
  } else if (isRejected) {
    // Set rejected ideas to have either high effort or low impact
    if (Math.random() > 0.5) {
      idea.effort = EffortLevel.VERY_HIGH;
    } else {
      idea.impact = ImpactLevel.LOW;
    }
  }
});

// Function to get ideas by status
export const getIdeasByStatus = (status: IdeaStatus): Idea[] => {
  return mockIdeas.filter(idea => idea.status === status);
};

// Function to get ideas by department (of submitter)
export const getIdeasByDepartment = (department: string): Idea[] => {
  return mockIdeas.filter(idea => {
    // This would require looking up the submitter and checking their department
    // For mock data purposes, we're keeping it simple and assuming the filter works
    return true; // In a real app, this would filter based on submitter's department
  });
};

// Function to assign an approver to an idea
export const assignApprover = (ideaId: string): Idea | null => {
  const ideaIndex = mockIdeas.findIndex(idea => idea.id === ideaId);
  if (ideaIndex === -1) return null;
  
  const idea = mockIdeas[ideaIndex];
  const approvers = getApproversForCategory(idea.category);
  
  if (approvers.length === 0) return null;
  
  // Randomly select an approver from the eligible ones
  const randomApprover = approvers[Math.floor(Math.random() * approvers.length)];
  
  // Update the idea with the assigned approver and change status
  const updatedIdea = {
    ...idea,
    assignedApproverId: randomApprover.id,
    status: IdeaStatus.UNDER_REVIEW,
    lastModified: new Date().toISOString()
  };
  
  // In a real app, this would update a database
  // For mock data, we'll just return the updated idea
  return updatedIdea;
};