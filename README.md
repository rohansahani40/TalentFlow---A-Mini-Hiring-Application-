# TalentFlow - ATS (Applicant Tracking System)

A modern, full-featured Applicant Tracking System built with React, Vite, and IndexedDB. TalentFlow provides comprehensive job management, candidate tracking, and assessment capabilities with a beautiful dark-themed UI.

## 🚀 Features

### Job Management
- **Job Listings**: Browse and manage job postings with advanced filtering
- **Job Details**: Comprehensive job information with skills, salary, and location
- **Job Creation/Editing**: Full CRUD operations for job postings
- **Status Management**: Active/Closed job status tracking
- **Drag & Drop Reordering**: Intuitive job list reordering

### Candidate Management
- **Candidate List**: Search and filter candidates by name, email, stage, and job
- **Kanban Board**: Visual candidate pipeline with drag-and-drop stage management
- **Candidate Details**: Individual candidate profiles with timeline tracking
- **Stage Management**: Track candidates through application stages (Applied, Screen, Tech, Offer, Hired, Rejected)

### Assessment System
- **Assessment Builder**: Create custom assessments with multiple question types
- **Question Types**: Support for short text, long text, single choice, multi choice, numeric, and file upload
- **Question Editor**: Dynamic question creation with options management
- **Assessment Forms**: Candidate-facing assessment interface

### Technical Features
- **Offline-First**: Works without internet connection using IndexedDB
- **Mock API**: MSW (Mock Service Worker) for development and testing
- **Real-time Updates**: Optimistic UI updates with React Query
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Dark Theme**: Modern dark UI design

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI library with latest features
- **Vite 7.1.2** - Fast build tool and dev server
- **React Router DOM 7.9.1** - Client-side routing
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **@tanstack/react-query 5.87.4** - Server state management
- **@tanstack/react-virtual 3.13.12** - Virtual scrolling for large lists

### Drag & Drop
- **@dnd-kit/core 6.3.1** - Accessible drag and drop
- **@dnd-kit/sortable 10.0.0** - Sortable functionality
- **@dnd-kit/modifiers 9.0.0** - Drag modifiers

### Data & Storage
- **Dexie 4.2.0** - IndexedDB wrapper for client-side storage
- **MSW 2.11.2** - Mock Service Worker for API mocking

### Development Tools
- **ESLint 9.35.0** - Code linting
- **Prettier 3.6.2** - Code formatting
- **TypeScript** - Type definitions for React

## 📁 Project Structure

```
talent_flow/
├── public/
│   └── mockServiceWorker.js          # MSW service worker
├── src/
│   ├── api/                          # API layer
│   │   ├── index.js                  # API exports
│   │   ├── jobsApi.js                # Job-related API calls
│   │   ├── candidatesApi.js          # Candidate-related API calls
│   │   └── assessmentsApi.js         # Assessment-related API calls
│   ├── assets/                       # Static assets
│   ├── components/                   # Reusable UI components
│   │   ├── assessments/              # Assessment-specific components
│   │   │   ├── QuestionEditor.jsx    # Question creation/editing
│   │   │   ├── QuestionPreview.jsx   # Question preview
│   │   │   └── validation.js         # Form validation utilities
│   │   ├── candidates/               # Candidate-specific components
│   │   │   ├── CandidateCard.jsx     # Individual candidate card
│   │   │   ├── CandidateKanbanColumn.jsx # Kanban column
│   │   │   ├── CandidateSearchBar.jsx # Search functionality
│   │   │   └── DraggableCandidateCard.jsx # Draggable candidate card
│   │   ├── jobs/                     # Job-specific components
│   │   │   ├── JobCard.jsx           # Job listing card
│   │   │   ├── JobForm.jsx           # Job creation/editing form
│   │   │   └── JobForms.jsx          # Job form wrapper
│   │   └── common/                   # Shared components
│   │       ├── Button.jsx            # Reusable button component
│   │       ├── ErrorBoundary.jsx     # Error boundary wrapper
│   │       ├── ErrorMessage.jsx      # Error display component
│   │       ├── Footer.jsx            # App footer
│   │       ├── Loader.jsx            # Loading spinner
│   │       ├── Modal.jsx             # Modal dialog
│   │       ├── Navbar.jsx            # Navigation bar
│   │       └── Notes.jsx             # Notes component
│   ├── db/                           # Database layer
│   │   ├── db.js                     # Dexie database configuration
│   │   └── seed.js                   # Database seeding
│   ├── hooks/                        # Custom React hooks
│   │   ├── useJobs.js                # Job-related hooks
│   │   └── useCandidates.js          # Candidate-related hooks
│   ├── mocks/                        # Mock API setup
│   │   ├── browser.js                # MSW browser setup
│   │   ├── handlers.js               # API request handlers
│   │   └── utils.js                  # Mock utilities
│   ├── pages/                        # Page components
│   │   ├── AssessmentBuilder.jsx     # Assessment creation page
│   │   ├── AssessmentForm.jsx        # Assessment taking page
│   │   ├── CandidateDetails.jsx      # Individual candidate page
│   │   ├── CandidatesBoard.jsx       # Kanban board page
│   │   ├── CandidatesList.jsx        # Candidate list page
│   │   ├── JobDetails.jsx            # Individual job page
│   │   └── JobsList.jsx              # Job listings page
│   ├── routes/                       # Routing configuration
│   │   └── routes.jsx                # App routes definition
│   ├── App.jsx                       # Main app component
│   ├── main.jsx                      # App entry point
│   └── index.css                     # Global styles
├── package.json                      # Dependencies and scripts
└── vite.config.js                    # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd talentFlow/talent_flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Architecture

### Frontend Architecture

TalentFlow follows a modern React architecture with clear separation of concerns:

#### **Component Architecture**
- **Pages**: Top-level route components that orchestrate data fetching and layout
- **Components**: Reusable UI components organized by feature domain
- **Hooks**: Custom hooks for data fetching and state management
- **API Layer**: Centralized API calls with consistent error handling

#### **State Management**
- **React Query**: Server state management with caching, background updates, and optimistic updates
- **Local State**: React useState/useReducer for component-level state
- **IndexedDB**: Client-side persistence using Dexie

#### **Data Flow**
1. **API Layer** → **React Query Hooks** → **Components**
2. **User Actions** → **Mutations** → **Optimistic Updates** → **Server Sync**
3. **Offline Support** → **IndexedDB** → **Background Sync**

### Database Schema

The application uses IndexedDB with the following schema:

```javascript
// Jobs table
jobs: "++id,slug,title,description,skills,experienceLevel,salaryRange,location,status,order,tags"

// Candidates table  
candidates: "++id,name,email,jobId,stage"

// Timeline table
timelines: "++id,candidateId,event,createdAt"

// Assessments table
assessments: "++id,jobId,title,questions"

// Submissions table
submissions: "++id,jobId,assessmentId,candidateId,answers,submittedAt"

// Assessment drafts
assessmentDrafts: "jobId,title,questions"
```

## 🔧 Technical Decisions

### 1. **React Query for State Management**
**Decision**: Use TanStack React Query instead of Redux or Context API
**Rationale**: 
- Excellent caching and background synchronization
- Built-in optimistic updates
- Automatic refetching and stale data handling
- Reduces boilerplate compared to Redux
- Perfect for server state management

### 2. **IndexedDB with Dexie**
**Decision**: Use IndexedDB for client-side storage instead of localStorage or sessionStorage
**Rationale**:
- Supports complex data structures and relationships
- Better performance for large datasets
- Offline-first architecture support
- ACID transactions
- Dexie provides a clean, Promise-based API

### 3. **MSW for API Mocking**
**Decision**: Use Mock Service Worker instead of JSON files or hardcoded data
**Rationale**:
- Realistic network behavior simulation
- Easy to switch between mock and real APIs
- Supports all HTTP methods and status codes
- Works in both browser and Node.js environments
- Better testing capabilities

### 4. **Tailwind CSS for Styling**
**Decision**: Use Tailwind CSS instead of CSS-in-JS or traditional CSS
**Rationale**:
- Rapid development with utility classes
- Consistent design system
- Small bundle size with purging
- Excellent dark theme support
- Great developer experience

### 5. **@dnd-kit for Drag & Drop**
**Decision**: Use @dnd-kit instead of react-beautiful-dnd or react-dnd
**Rationale**:
- Better accessibility support
- More flexible and customizable
- Better TypeScript support
- Active maintenance and community
- Works well with React 18+

### 6. **Vite as Build Tool**
**Decision**: Use Vite instead of Create React App or Webpack
**Rationale**:
- Faster development server with HMR
- Better performance with esbuild
- Modern tooling with minimal configuration
- Excellent TypeScript support
- Smaller bundle sizes

## 🐛 Known Issues

### Current Limitations

1. **File Upload Support**
   - File upload questions are created but not fully implemented
   - No file storage or retrieval mechanism

2. **Assessment Submission**
   - Assessment submission endpoint exists but UI integration is incomplete
   - No candidate assessment history view

3. **Real-time Collaboration**
   - No real-time updates when multiple users are using the system
   - Changes are only visible after page refresh

4. **Data Persistence**
   - Data is stored locally in IndexedDB
   - No cloud sync or backup functionality

5. **Authentication**
   - No user authentication or authorization
   - All data is accessible to anyone with the application

### Performance Considerations

1. **Large Candidate Lists**
   - Virtual scrolling is implemented but may need optimization for very large lists
   - Consider pagination for better performance

2. **Database Queries**
   - Some queries could be optimized with proper indexing
   - Consider implementing query result caching

3. **Bundle Size**
   - Current bundle size is reasonable but could be optimized further
   - Consider code splitting for better loading performance

## 🚧 Future Enhancements

### Planned Features

1. **Authentication & Authorization**
   - User login/logout
   - Role-based access control
   - Multi-tenant support

2. **Real-time Features**
   - WebSocket integration for real-time updates
   - Live collaboration on candidate management

3. **Advanced Assessment Features**
   - Question banks and templates
   - Automated scoring
   - Assessment analytics

4. **Reporting & Analytics**
   - Candidate pipeline analytics
   - Job performance metrics
   - Custom reporting dashboard

5. **Integration Capabilities**
   - Email integration
   - Calendar scheduling
   - Third-party ATS imports

6. **Mobile Application**
   - React Native mobile app
   - Offline support
   - Push notifications

## 🤝 Contributing

### Development Guidelines

1. **Code Style**
   - Follow ESLint configuration
   - Use Prettier for code formatting
   - Write meaningful commit messages

2. **Component Guidelines**
   - Use functional components with hooks
   - Keep components small and focused
   - Use TypeScript for type safety

3. **Testing**
   - Write unit tests for utilities and hooks
   - Add integration tests for critical user flows
   - Maintain test coverage above 80%

4. **Documentation**
   - Update README for new features
   - Document API changes
   - Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the excellent framework
- TanStack team for React Query
- Dexie team for the IndexedDB wrapper
- MSW team for the mocking solution
- Tailwind CSS team for the utility framework
- @dnd-kit team for the drag and drop solution
