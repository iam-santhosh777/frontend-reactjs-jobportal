# Quick Start Guide

## Prerequisites

- Node.js 20+ installed
- Backend API server running (see API_REFERENCE.md for endpoints)

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_SOCKET_URL=http://localhost:3000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

## Testing the Application

### Login Credentials
The frontend expects the backend to handle authentication. Use these example credentials:

- **HR User:**
  - Email: `hr@example.com`
  - Password: `password123`

- **Regular User:**
  - Email: `user@example.com`
  - Password: `password123`

### User Flow

1. **Login** → Enter credentials → Redirected to appropriate dashboard
2. **User Dashboard:**
   - View active jobs
   - Click "Apply Now" on any job
   - See success toast notification
3. **HR Dashboard:**
   - View dashboard statistics
   - Post new jobs using "Post New Job" button
   - Mark jobs as expired using "Mark as Expired" button
   - Upload resumes (multiple files supported)
   - View job applications in real-time

### Real-Time Features

1. **New Application Notification (HR):**
   - When a user applies to a job, HR receives a toast notification
   - Application list automatically updates

2. **Job Expiration:**
   - When HR marks a job as expired, it disappears from user dashboard
   - User dashboard refreshes to show only active jobs

## Project Structure Overview

```
src/
├── components/       # Reusable UI components
├── contexts/         # React Context for state management
├── pages/           # Main page components
├── services/        # API and Socket.io services
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## Key Features Implemented

✅ Authentication with role-based redirect  
✅ Protected routes with RBAC  
✅ User dashboard with job listings  
✅ Job application functionality  
✅ HR dashboard with statistics  
✅ Job management (create, expire)  
✅ Resume upload with progress tracking  
✅ Retry failed uploads  
✅ Real-time notifications via WebSocket  
✅ Toast notifications for user feedback  
✅ Clean component architecture  
✅ TypeScript for type safety  

## Troubleshooting

### Socket.io Connection Issues
- Ensure backend Socket.io server is running
- Check `VITE_SOCKET_URL` in `.env` file
- Verify JWT token is being sent in Socket.io auth

### API Errors
- Verify backend API is running
- Check `VITE_API_BASE_URL` in `.env` file
- Ensure JWT token is stored in localStorage after login

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires 20+)

## Next Steps

1. Connect to your backend API
2. Update environment variables for production
3. Customize UI styling if needed
4. Add additional features as required

