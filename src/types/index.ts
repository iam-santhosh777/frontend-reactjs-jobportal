export type UserRole = 'hr' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  expiryDate: string;
  createdAt: string;
  isActive: boolean;
  isExpired: boolean;
  expiry_status?: 'active' | 'expired';
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  userEmail: string;
  appliedAt: string;
  jobTitle: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
}

export interface Resume {
  id: string | number;
  filename: string;
  fileName?: string; // Legacy support
  fileSize?: number;
  jobId?: number | string | null;
  jobTitle?: string | null;
  status: 'uploading' | 'success' | 'failed' | 'uploaded';
  createdAt?: string;
  uploadedAt?: string; // Legacy support
  downloadUrl?: string;
  viewUrl?: string;
  cloudinaryUrl?: string;
}

export interface DashboardStats {
  totalJobs: number;
  totalApplications: number;
  expiredJobs: number;
  totalResumes: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

