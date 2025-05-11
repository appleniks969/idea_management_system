# IDEA MANAGEMENT SYSTEM - PRODUCT REQUIREMENTS DOCUMENT

## 1. INTRODUCTION

### 1.1 Purpose
This document outlines the requirements for an Idea Management System MVP that will allow employees to submit ideas for review, route them through an approval process, and provide dashboard visualization of submission status and metrics.

### 1.2 Scope
The MVP will deliver core functionality including idea submission, a simplified approval workflow with 10 predefined approvers, and basic dashboard visualization. The system will use a Kotlin backend and React frontend with plans for future integration with external systems.

## 2. PRODUCT OVERVIEW

### 2.1 Product Vision
Create a streamlined platform that captures employee innovation, facilitates structured evaluation, and tracks implementation of ideas across the organization.

### 2.2 Target Users
- **Submitters**: All employees
- **Approvers**: 10 predefined users with approval authority
- **Administrators**: IT staff managing the system

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Idea Submission Form

- **IMS-F-101**: Users shall submit ideas through a web form with fields for:
  - Idea title (required)
  - Description (required)
  - Department/category (dropdown selection)
  - Expected benefits
  - Supporting attachments (optional)

- **IMS-F-102**: System shall validate all required fields before submission
- **IMS-F-103**: System shall assign a unique ID to each submission
- **IMS-F-104**: Users shall receive confirmation upon successful submission

### 3.2 Approval Workflow

- **IMS-F-201**: System shall route submissions to appropriate approvers based on idea category
- **IMS-F-202**: Approvers shall review submissions and select one action:
  - Approve
  - Request revisions (with comments)
  - Reject (with reason)

- **IMS-F-203**: System shall track the status of each idea:
  - Submitted
  - Under Review
  - Approved
  - Revision Requested
  - Rejected

- **IMS-F-204**: System shall notify submitters of status changes via email

### 3.3 Dashboard

- **IMS-F-301**: Dashboard shall display:
  - List of ideas with status indicators
  - Summary metrics (count by status, department)
  - Simple filtering options

- **IMS-F-302**: Approvers shall have a personalized view showing ideas pending their review
- **IMS-F-303**: Simple sorting and filtering capabilities shall be provided

### 3.4 User Management (MVP)

- **IMS-F-401**: System shall support 10 hardcoded approver accounts
- **IMS-F-402**: Each approver shall be assigned specific departments/categories
- **IMS-F-403**: Basic authentication shall be implemented
- **IMS-F-404**: Three user roles shall be supported: Submitter, Approver, Administrator

## 4. TECHNICAL REQUIREMENTS

### 4.1 Backend (Kotlin)

- **IMS-T-101**: Backend shall be built using Kotlin with Ktor framework
- **IMS-T-102**: RESTful API shall be implemented for communication with frontend
- **IMS-T-103**: JWT authentication shall be used for user session management
- **IMS-T-104**: For MVP simplicity, data shall be stored using an embedded database (H2 or SQLite)
- **IMS-T-105**: Database migrations shall be handled using a simple solution (Exposed or JDBC)
- **IMS-T-106**: Backend shall be containerized for easy deployment

### 4.2 Frontend (React)

- **IMS-T-201**: Frontend shall be built using React 18+ with TypeScript
- **IMS-T-202**: Vite shall be used as the build tool
- **IMS-T-203**: Recharts shall be used for dashboard visualizations
- **IMS-T-204**: Responsive design shall support desktop and tablet viewing

### 4.3 Integration

- **IMS-T-301**: System shall use a service-based architecture to facilitate future external system integration
- **IMS-T-302**: API documentation shall be generated automatically using Swagger/OpenAPI

## 5. KOTLIN IMPLEMENTATION DETAILS

- **IMS-K-101**: Domain models shall include:
  - Idea (id, title, description, category, benefits, submitterId, status, date, etc.)
  - User (id, username, fullName, email, role, department, approvalCategories, isActive)
  - Comment (id, ideaId, userId, text, date, type)
  - AuditLog (id, action, timestamp, userId, details)

- **IMS-K-102**: System shall implement the following service components:
  - IdeaService (CRUD operations for ideas)
  - UserService (user management, authentication)
  - ApprovalService (workflow management, notifications)
  - DashboardService (metrics and reporting)

- **IMS-K-103**: Approvers shall be initialized in the database during system startup
- **IMS-K-104**: System shall use Kotlin coroutines for asynchronous operations
- **IMS-K-105**: Email notifications shall use a simple SMTP client
- **IMS-K-106**: Dependency injection shall be used to facilitate testing and future extensions

## 6. MVP SCOPE

### 6.1 Included Features
- Complete idea submission form
- Basic approval workflow
- Simple dashboard with idea status
- Hardcoded approver management
- Basic email notifications
- Authentication and authorization

### 6.2 Excluded Features (Future Development)
- Advanced workflow configuration
- Integration with external approver systems
- Mobile application
- Advanced analytics
- Document management
- Idea implementation tracking

## 7. IMPLEMENTATION PHASES

### 7.1 Phase 1: Foundation (2 weeks)
- Setup Kotlin backend with Ktor
- Setup React frontend with Vite
- Implement database schema and models
- Configure hardcoded approvers
- Create API endpoints for core operations

### 7.2 Phase 2: Core Features (2 weeks)
- Implement idea submission form
- Create approval workflow
- Develop basic dashboard
- Implement authentication
- Connect frontend to backend APIs

### 7.3 Phase 3: Completion & Testing (1 week)
- Implement email notifications
- Finalize dashboard visualizations with Recharts
- Complete testing and bug fixes
- Documentation and deployment

## 8. ACCEPTANCE CRITERIA

### 8.1 Submission Flow
- Users can successfully submit ideas through the form
- Form validates all required fields
- Users receive confirmation with tracking ID

### 8.2 Approval Flow
- Ideas are routed to correct approvers
- Approvers can review and take action on ideas
- Status updates are tracked accurately
- Submitters receive notifications of status changes

### 8.3 Dashboard
- Dashboard displays accurate idea counts and statuses
- Filtering and sorting functions work as expected
- Recharts visualizations render correctly

## 9. TECHNICAL DETAILS

### 9.1 API Endpoints

- `/api/ideas` - CRUD operations for ideas
  - GET `/api/ideas` - List all ideas (with filters)
  - POST `/api/ideas` - Submit new idea
  - GET `/api/ideas/{id}` - Get idea details
  - PUT `/api/ideas/{id}` - Update idea
  - POST `/api/ideas/{id}/approve` - Approve idea
  - POST `/api/ideas/{id}/reject` - Reject idea
  - POST `/api/ideas/{id}/request-revision` - Request revision

- `/api/users` - User authentication and info
  - POST `/api/users/login` - Authenticate user
  - GET `/api/users/current` - Get current user
  - GET `/api/users/approvers` - Get approvers list

- `/api/dashboard` - Dashboard data
  - GET `/api/dashboard/metrics` - Get metrics data
  - GET `/api/dashboard/by-status` - Get idea counts by status
  - GET `/api/dashboard/by-department` - Get idea counts by department

### 9.2 Database Schema

The system will use the following tables:

1. **ideas**
   - id (PK)
   - title
   - description
   - category
   - benefits
   - submitter_id (FK to users)
   - status
   - date_submitted
   - last_modified
   - assigned_approver_id (FK to users)

2. **users**
   - id (PK)
   - username
   - password_hash
   - full_name
   - email
   - role
   - department
   - approval_categories
   - is_active

3. **comments**
   - id (PK)
   - idea_id (FK to ideas)
   - user_id (FK to users)
   - comment_text
   - comment_date
   - comment_type

4. **audit_log**
   - id (PK)
   - action
   - timestamp
   - user_id (FK to users)
   - details

### 9.3 Future Integration Considerations

- RESTful API design will facilitate future integration with external systems
- Service layer will abstract data access for potential future changes
- Authentication system will be designed to support future SSO integration

---

**Version**: 1.2  
**Date**: May 11, 2025  
**Status**: Draft  
**Change**: Updated to use Kotlin backend for MVP