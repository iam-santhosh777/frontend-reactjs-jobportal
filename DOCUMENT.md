# Documentation

This document contains all the essential information for setting up, using, and deploying the Job Portal application.

---

## Table of Contents

1. [Quick Start Guide](#quick-start-guide)
2. [API Reference](#api-reference)
3. [Vercel Deployment Guide](#vercel-deployment-guide)

---

## Quick Start Guide

### Prerequisites

- Node.js 20+ installed
- Backend API server running (see [API Reference](#api-reference) for endpoints)

### Setup Steps

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

### Testing the Application

#### Login Credentials
The frontend expects the backend to handle authentication. Use these example credentials:

- **HR User:**
  - Email: `hr@example.com`
  - Password: `password123`

- **Regular User:**
  - Email: `user@example.com`
  - Password: `password123`

#### User Flow

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

#### Real-Time Features

1. **New Application Notification (HR):**
   - When a user applies to a job, HR receives a toast notification
   - Application list automatically updates

2. **Job Expiration:**
   - When HR marks a job as expired, it disappears from user dashboard
   - User dashboard refreshes to show only active jobs

### Project Structure Overview

```
src/
├── components/       # Reusable UI components
├── contexts/         # React Context for state management
├── pages/           # Main page components
├── services/        # API and Socket.io services
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

### Key Features Implemented

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

### Troubleshooting

#### Socket.io Connection Issues
- Ensure backend Socket.io server is running
- Check `VITE_SOCKET_URL` in `.env` file
- Verify JWT token is being sent in Socket.io auth

#### API Errors
- Verify backend API is running
- Check `VITE_API_BASE_URL` in `.env` file
- Ensure JWT token is stored in localStorage after login

#### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires 20+)

### Next Steps

1. Connect to your backend API
2. Update environment variables for production
3. Customize UI styling if needed
4. Add additional features as required

---

## API Reference

This document outlines the expected backend API endpoints that the frontend integrates with.

### Base URL

```
http://localhost:3000/api
```

### Authentication

#### Login
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user" | "hr"
    },
    "token": "jwt-token-string"
  }
  ```

### Jobs

#### Get All Jobs (HR)
- **Endpoint:** `GET /api/jobs`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [
    {
      "id": "job-id",
      "title": "Software Engineer",
      "description": "Job description...",
      "company": "Company Name",
      "location": "City, Country",
      "salary": "$50,000 - $70,000",
      "expiryDate": "2024-12-31T23:59:59.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "isActive": true,
      "isExpired": false
    }
  ]
  ```

#### Get Active Jobs (User)
- **Endpoint:** `GET /api/jobs/active`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Same as Get All Jobs, but filtered to active jobs

#### Create Job
- **Endpoint:** `POST /api/jobs`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "title": "Software Engineer",
    "description": "Job description...",
    "company": "Company Name",
    "location": "City, Country",
    "salary": "$50,000 - $70,000",
    "expiryDate": "2024-12-31T23:59:59.000Z"
  }
  ```
- **Response:** Job object (same structure as above)

#### Mark Job as Expired
- **Endpoint:** `PATCH /api/jobs/:id/expire`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Updated job object with `isExpired: true`

#### Apply to Job
- **Endpoint:** `POST /api/jobs/:id/apply`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "id": "application-id",
    "jobId": "job-id",
    "userId": "user-id",
    "userName": "User Name",
    "userEmail": "user@example.com",
    "appliedAt": "2024-01-01T00:00:00.000Z",
    "jobTitle": "Software Engineer",
    "status": "pending"
  }
  ```
- **WebSocket Event:** After successful application, backend should emit `new-application` event to HR users

### Applications

#### Get All Applications (HR)
- **Endpoint:** `GET /api/applications`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [
    {
      "id": "application-id",
      "jobId": "job-id",
      "userId": "user-id",
      "userName": "User Name",
      "userEmail": "user@example.com",
      "appliedAt": "2024-01-01T00:00:00.000Z",
      "jobTitle": "Software Engineer",
      "status": "pending" | "reviewed" | "rejected" | "accepted"
    }
  ]
  ```

### Dashboard

#### Get Dashboard Statistics
- **Endpoint:** `GET /api/dashboard/stats`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "totalJobs": 10,
    "totalApplications": 25,
    "expiredJobs": 3,
    "totalResumes": 15
  }
  ```

### Resumes

#### Upload Resume
- **Endpoint:** `POST /api/resumes/upload`
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body:** FormData with field name `resume` containing the file
- **Response:**
  ```json
  {
    "id": "resume-id",
    "fileName": "resume.pdf",
    "fileSize": 102400,
    "uploadedAt": "2024-01-01T00:00:00.000Z",
    "status": "success"
  }
  ```

#### Get All Resumes
- **Endpoint:** `GET /api/resumes`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [
    {
      "id": "resume-id",
      "fileName": "resume.pdf",
      "fileSize": 102400,
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "status": "success"
    }
  ]
  ```

### WebSocket Events

#### Connection
- **URL:** `http://localhost:3000`
- **Auth:** Token passed in connection auth object
- **Event:** `new-application`
  - **Emitted to:** HR users only
  - **Payload:**
    ```json
    {
      "id": "application-id",
      "jobId": "job-id",
      "userId": "user-id",
      "userName": "User Name",
      "userEmail": "user@example.com",
      "appliedAt": "2024-01-01T00:00:00.000Z",
      "jobTitle": "Software Engineer",
      "status": "pending"
    }
    ```

### Error Responses

All endpoints should return errors in the following format:

```json
{
  "message": "Error message here"
}
```

Status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Vercel Deployment Guide

### Environment Variables Setup

To ensure your app connects to the correct backend in production, you need to set environment variables in Vercel.

#### Steps:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variable:

   **Name:** `VITE_API_BASE_URL`
   
   **Value:** `https://backend-nodejs-jobportal-production.up.railway.app/api`
   
   **Environment:** Select all (Production, Preview, Development)

4. Click **Save**

5. Redeploy your application for the changes to take effect

### Automatic Fallback

If you don't set the environment variable, the app will automatically use the Railway production URL when deployed to Vercel (production mode). However, it's recommended to set it explicitly in Vercel for better control.

### Verification

After deployment, check the browser console to verify the API base URL being used. It should show:
```
https://backend-nodejs-jobportal-production.up.railway.app/api
```

If you see `http://localhost:3000/api`, the environment variable is not set correctly.

