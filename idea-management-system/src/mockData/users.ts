import { User, UserRole } from '../types';

// Departments
export const departments = [
  'Engineering',
  'Marketing',
  'Finance',
  'HR',
  'Operations',
  'Product',
  'Sales',
  'Legal',
  'Customer Support'
];

// Categories for idea submission
export const categories = [
  'Process Improvement',
  'Product Enhancement',
  'Cost Saving',
  'Employee Experience',
  'Customer Experience',
  'Sustainability',
  'Technology Innovation',
  'Revenue Generation',
  'Risk Reduction'
];

// Mock users data
export const mockUsers: User[] = [
  // Administrators
  {
    id: 'admin1',
    username: 'admin',
    passwordHash: 'admin123', // In a real app, we would never store passwords like this
    fullName: 'System Administrator',
    email: 'admin@company.com',
    role: UserRole.ADMINISTRATOR,
    department: 'IT',
    isActive: true
  },
  
  // Approvers (10 predefined approvers as per requirements)
  {
    id: 'approver1',
    username: 'jsmith',
    passwordHash: 'password123',
    fullName: 'John Smith',
    email: 'john.smith@company.com',
    role: UserRole.APPROVER,
    department: 'Engineering',
    approvalCategories: ['Process Improvement', 'Technology Innovation'],
    isActive: true
  },
  {
    id: 'approver2',
    username: 'mjohnson',
    passwordHash: 'password123',
    fullName: 'Maria Johnson',
    email: 'maria.johnson@company.com',
    role: UserRole.APPROVER,
    department: 'Marketing',
    approvalCategories: ['Product Enhancement', 'Customer Experience'],
    isActive: true
  },
  {
    id: 'approver3',
    username: 'rwilliams',
    passwordHash: 'password123',
    fullName: 'Robert Williams',
    email: 'robert.williams@company.com',
    role: UserRole.APPROVER,
    department: 'Finance',
    approvalCategories: ['Cost Saving', 'Revenue Generation'],
    isActive: true
  },
  {
    id: 'approver4',
    username: 'jbrown',
    passwordHash: 'password123',
    fullName: 'Jessica Brown',
    email: 'jessica.brown@company.com',
    role: UserRole.APPROVER,
    department: 'HR',
    approvalCategories: ['Employee Experience'],
    isActive: true
  },
  {
    id: 'approver5',
    username: 'mdavis',
    passwordHash: 'password123',
    fullName: 'Michael Davis',
    email: 'michael.davis@company.com',
    role: UserRole.APPROVER,
    department: 'Operations',
    approvalCategories: ['Process Improvement', 'Cost Saving'],
    isActive: true
  },
  {
    id: 'approver6',
    username: 'agarcia',
    passwordHash: 'password123',
    fullName: 'Ana Garcia',
    email: 'ana.garcia@company.com',
    role: UserRole.APPROVER,
    department: 'Product',
    approvalCategories: ['Product Enhancement', 'Technology Innovation'],
    isActive: true
  },
  {
    id: 'approver7',
    username: 'trodriguez',
    passwordHash: 'password123',
    fullName: 'Thomas Rodriguez',
    email: 'thomas.rodriguez@company.com',
    role: UserRole.APPROVER,
    department: 'Sales',
    approvalCategories: ['Customer Experience', 'Revenue Generation'],
    isActive: true
  },
  {
    id: 'approver8',
    username: 'lwilson',
    passwordHash: 'password123',
    fullName: 'Laura Wilson',
    email: 'laura.wilson@company.com',
    role: UserRole.APPROVER,
    department: 'Legal',
    approvalCategories: ['Risk Reduction'],
    isActive: true
  },
  {
    id: 'approver9',
    username: 'kmartinez',
    passwordHash: 'password123',
    fullName: 'Kevin Martinez',
    email: 'kevin.martinez@company.com',
    role: UserRole.APPROVER,
    department: 'Customer Support',
    approvalCategories: ['Customer Experience', 'Process Improvement'],
    isActive: true
  },
  {
    id: 'approver10',
    username: 'clee',
    passwordHash: 'password123',
    fullName: 'Christine Lee',
    email: 'christine.lee@company.com',
    role: UserRole.APPROVER,
    department: 'Engineering',
    approvalCategories: ['Sustainability', 'Technology Innovation'],
    isActive: true
  },
  
  // Submitters (regular employees)
  {
    id: 'user1',
    username: 'jdoe',
    passwordHash: 'password123',
    fullName: 'Jane Doe',
    email: 'jane.doe@company.com',
    role: UserRole.SUBMITTER,
    department: 'Engineering',
    isActive: true
  },
  {
    id: 'user2',
    username: 'asmith',
    passwordHash: 'password123',
    fullName: 'Alex Smith',
    email: 'alex.smith@company.com',
    role: UserRole.SUBMITTER,
    department: 'Marketing',
    isActive: true
  },
  {
    id: 'user3',
    username: 'bjohnson',
    passwordHash: 'password123',
    fullName: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    role: UserRole.SUBMITTER,
    department: 'HR',
    isActive: true
  },
  {
    id: 'user4',
    username: 'skim',
    passwordHash: 'password123',
    fullName: 'Sarah Kim',
    email: 'sarah.kim@company.com',
    role: UserRole.SUBMITTER,
    department: 'Finance',
    isActive: true
  },
  {
    id: 'user5',
    username: 'rpatel',
    passwordHash: 'password123',
    fullName: 'Raj Patel',
    email: 'raj.patel@company.com',
    role: UserRole.SUBMITTER,
    department: 'Product',
    isActive: true
  }
];

// Function to get approvers for a specific category
export const getApproversForCategory = (category: string): User[] => {
  return mockUsers.filter(
    user => user.role === UserRole.APPROVER && 
    user.approvalCategories?.includes(category) &&
    user.isActive
  );
};

// Function to find a user by id
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};