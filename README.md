# Idea Management System

A streamlined platform that captures employee innovation, facilitates structured evaluation, and tracks implementation of ideas across the organization.

## Project Overview

The Idea Management System allows employees to:
- Submit innovative ideas through a structured form
- Route submissions through an approval workflow
- Visualize submission status and metrics via dashboards

## Current State

This project currently includes a React frontend implementation with:
- User interface for idea submission
- Approval dashboards
- Mock data for development and testing

The Kotlin backend (as specified in the PRD) is planned but not yet implemented.

## Tech Stack

### Frontend (Implemented)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **UI Library**: Material UI 7
- **Routing**: React Router 7
- **Form Handling**: Formik with Yup validation
- **Data Visualization**: Recharts
- **HTTP Client**: Axios

### Backend (Planned)
- **Language**: Kotlin
- **Framework**: Ktor
- **Database**: Embedded database (H2/SQLite) for MVP
- **Authentication**: JWT

## Prerequisites

- Node.js 16 or higher
- npm or yarn

## Development Setup

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd idea-management-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will be accessible at `http://localhost:5173`.

## Frontend Structure

```
idea-management-system/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── mockData/        # Mock data for development
│   ├── pages/           # Page components
│   │   ├── ApprovalDashboard.tsx
│   │   ├── Dashboard.tsx
│   │   ├── IdeaDetail.tsx
│   │   ├── IdeaSubmission.tsx
│   │   └── Login.tsx
│   ├── services/        # API service functions
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally

## User Roles

As specified in the PRD:
- **Submitters**: All employees can submit ideas
- **Approvers**: 10 predefined users with approval authority
- **Administrators**: IT staff managing the system

## Future Development

- Implementation of Kotlin backend
- Integration of real authentication system
- Connection to a database
- API implementation
- Deployment configuration

## Additional Documentation

Detailed requirements and specifications can be found in the PRD document: 
- [Idea Management System PRD](./idea_management_system_prd.md)