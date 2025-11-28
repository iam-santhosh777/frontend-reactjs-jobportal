# HRMS + Job Portal - Frontend

A complete React.js frontend application for an HRMS (Human Resource Management System) and Job Portal with real-time notifications using Socket.io.

## Features

### 🔐 Authentication & RBAC
- Single login interface for HR and Users
- Role-based access control (RBAC)
- Protected routes based on user roles
- Automatic redirect after login:
  - HR → HR Dashboard
  - User → User Dashboard

### 👤 User Dashboard
- View all active job listings
- Apply to jobs with one click
- Real-time job updates (expired jobs disappear immediately)
- Success notifications on application

### 👔 HR Dashboard
- **Dashboard Summary Widgets:**
  - Total jobs posted
  - Total applications received
  - Total expired jobs
  - Total resumes uploaded

- **Job Management:**
  - Post new jobs with form
  - Set expiry dates
  - Mark jobs as expired (removes from user dashboard immediately)

- **Resume Upload:**
  - Upload multiple resumes simultaneously
  - Real-time upload progress per file
  - Retry failed uploads with one click

- **Job Applications (Real-Time):**
  - Receive WebSocket notifications for new applications
  - Toast notifications + automatic list updates
  - View all applications in a table format

## Environment Setup

### Development Environment

1. Create a `.env.development` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

2. Run the development server:
```bash
npm run dev
```

### Production Environment

1. **For local production builds**, create a `.env.production` file:
```env
VITE_API_BASE_URL=https://backend-nodejs-jobportal-production.up.railway.app/api
```

2. **For Vercel deployment**, set the environment variable in Vercel Dashboard:
   - Go to your project settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://backend-nodejs-jobportal-production.up.railway.app/api`
   - Apply to: Production, Preview, and Development environments

3. Build for production:
```bash
npm run build
```

**Note:** The code automatically uses the Railway URL in production if `VITE_API_BASE_URL` is not set, but it's recommended to set it in Vercel for clarity.

### Environment Variables

- `VITE_API_BASE_URL`: The base URL for the backend API
  - Development: `http://localhost:3000/api`
  - Production: `https://backend-nodejs-jobportal-production.up.railway.app/api`

**Note:** Vite automatically loads `.env.development` when running `npm run dev` and `.env.production` when building with `npm run build`.

## Tech Stack

- **React.js 19+** with TypeScript
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API calls
- **Socket.io-client** for real-time WebSocket communication
- **Material-UI (MUI)** for UI components
- **React Hot Toast** for notifications
- **Tailwind CSS** (configured but using MUI primarily)

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── DashboardWidget.tsx
│   ├── JobApplicationList.tsx
│   ├── JobCard.tsx
│   ├── JobForm.tsx
│   ├── Layout.tsx
│   ├── ProtectedRoute.tsx
│   └── ResumeUpload.tsx
├── contexts/            # React Context providers
│   ├── AuthContext.tsx
│   └── SocketContext.tsx
├── pages/               # Page components
│   ├── HRDashboard.tsx
│   ├── Login.tsx
│   └── UserDashboard.tsx
├── services/            # API and service layers
│   ├── api.ts
│   └── socket.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx              # Main app component with routing
└── main.tsx             # Entry point
```

## Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   The project uses separate environment files for development and production:
   
   - `.env.development` - Used when running `npm run dev`
   - `.env.production` - Used when running `npm run build`
   
   These files are already created with the correct values:
   - Development: `http://localhost:3000/api`
   - Production: `https://backend-nodejs-jobportal-production.up.railway.app/api`
   
   **Note:** The socket URL is automatically derived from the API URL.

3. **Start development server:**
   
   **Local development (connects to localhost backend):**
   ```bash
   npm run dev
   ```
   
   **Local development with production backend (for testing):**
   ```bash
   npm run dev:prod
   ```
   This runs the dev server locally (with hot reload) but connects to the production Railway backend. Uses `.env.dev-prod` file.

4. **Build for production:**
   ```bash
   npm run build
   ```

## API Integration

The frontend expects the following backend API endpoints:

### Authentication
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs (HR)
- `GET /api/jobs/active` - Get active jobs (User)
- `POST /api/jobs` - Create new job
- `PATCH /api/jobs/:id/expire` - Mark job as expired
- `POST /api/jobs/:id/apply` - Apply to a job

### Applications
- `GET /api/applications` - Get all applications (HR)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Resumes
- `POST /api/resumes/upload` - Upload resume (multipart/form-data)
- `GET /api/resumes` - Get all resumes

## WebSocket Events

The frontend listens for the following Socket.io events:

- `new-application` - Emitted when a new job application is received (HR only)

## Authentication Flow

1. User logs in with email and password
2. Backend returns user object and JWT token
3. Token is stored in localStorage
4. User is redirected based on role:
   - `hr` → `/hr/dashboard`
   - `user` → `/user/dashboard`
5. Socket.io connection is established for HR users
6. Protected routes check authentication and role

## Component Architecture

### Reusable Components
- **JobCard**: Displays job information with apply/expire actions
- **DashboardWidget**: Stat widget for dashboard summary
- **ResumeUpload**: Multi-file upload with progress and retry
- **JobForm**: Form for creating new job postings
- **JobApplicationList**: Table displaying all job applications
- **Layout**: Common layout with header and navigation
- **ProtectedRoute**: Route guard for authentication and RBAC

### Context Providers
- **AuthContext**: Manages authentication state and user session
- **SocketContext**: Manages Socket.io connection and real-time events

## Real-Time Features

1. **Job Expiration**: When HR marks a job as expired, it immediately disappears from the user dashboard
2. **New Applications**: HR receives real-time toast notifications when users apply to jobs
3. **Application List**: Automatically updates when new applications are received

## Error Handling

- API errors are caught and displayed via toast notifications
- Failed file uploads show retry button
- Network errors are gracefully handled
- Loading states are shown during async operations

## Development Notes

- All API calls use Axios interceptors to attach JWT tokens
- Socket.io connection is only established for HR users
- File uploads support progress tracking
- Toast notifications provide user feedback for all actions
- TypeScript ensures type safety throughout the application

## License

MIT
