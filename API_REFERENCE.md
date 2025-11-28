# API Reference

This document outlines the expected backend API endpoints that the frontend integrates with.

## Base URL

```
http://localhost:3000/api
```

## Authentication

### Login
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

## Jobs

### Get All Jobs (HR)
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

### Get Active Jobs (User)
- **Endpoint:** `GET /api/jobs/active`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Same as Get All Jobs, but filtered to active jobs

### Create Job
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

### Mark Job as Expired
- **Endpoint:** `PATCH /api/jobs/:id/expire`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Updated job object with `isExpired: true`

### Apply to Job
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

## Applications

### Get All Applications (HR)
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

## Dashboard

### Get Dashboard Statistics
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

## Resumes

### Upload Resume
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

### Get All Resumes
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

## WebSocket Events

### Connection
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

## Error Responses

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


