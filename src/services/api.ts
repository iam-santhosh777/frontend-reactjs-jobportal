import axios from 'axios';
import type { LoginCredentials, AuthResponse, Job, JobApplication, DashboardStats, Resume } from '../types';

// API Base URL from environment variables
// Priority:
// 1. VITE_API_BASE_URL from environment (set in Vercel or .env files)
// 2. If in production mode and not set, use Railway production URL
// 3. Fallback to localhost for development
const getApiBaseUrl = () => {
  // If explicitly set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production (Vercel deployment), use Railway URL
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
    return 'https://backend-nodejs-jobportal-production.up.railway.app/api';
  }
  
  // Development fallback
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🌍 Environment:', import.meta.env.MODE);
  console.log('📦 Production Mode:', import.meta.env.PROD);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to extract data from backend response
// Backend may return { success, message, data } or direct data
const extractData = <T>(response: any): T => {
  // If response is already the expected type
  if (!response || typeof response !== 'object') {
    return response;
  }
  
  // If wrapped in { success, message, data }
  if ('data' in response && response.data !== undefined) {
    return response.data;
  }
  
  // If wrapped in { success, message, data: [...] } for arrays
  if ('data' in response && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Return as-is if no wrapping detected
  return response;
};

// Helper function to normalize job data from backend
const normalizeJob = (job: any): Job => {
  // Extract company from various possible locations
  const company = job.company || job.Company || job.companyName || job.company_name || job.posted_by_name || '';
  
  // Extract expiry date from various possible locations
  const expiryDate = 
    job.expiryDate || 
    job.expiry_date || 
    job.expiresAt || 
    job.expires_at ||
    job.expireDate ||
    job.expire_date ||
    job.endDate ||
    job.end_date ||
    '';
  
  // Extract expiry_status from API response
  const expiry_status = job.expiry_status || (job.isExpired ? 'expired' : 'active');
  
  // Map expiry_status to isExpired boolean
  const isExpired = expiry_status === 'expired' || 
    (job.isExpired !== undefined ? job.isExpired : (job.is_expired !== undefined ? job.is_expired : false));
  
  console.log('Normalizing job:', {
    id: job.id,
    title: job.title,
    company: company,
    expiryDate: expiryDate,
    expiry_status: expiry_status,
    isExpired: isExpired,
    original: job
  });

  return {
    id: String(job.id || job._id || ''),
    title: job.title || job.Title || '',
    description: job.description || job.Description || '',
    company: company,
    location: job.location || job.Location || '',
    salary: job.salary || job.Salary,
    expiryDate: expiryDate,
    createdAt: job.createdAt || job.created_at || job.created || job.CreatedAt || '',
    isActive: job.isActive !== undefined ? job.isActive : (job.is_active !== undefined ? job.is_active : true),
    isExpired: isExpired,
    expiry_status: expiry_status as 'active' | 'expired',
  };
};

// Helper function to normalize array of jobs
const normalizeJobs = (jobs: any[]): Job[] => {
  if (!Array.isArray(jobs)) {
    return [];
  }
  return jobs.map(normalizeJob).filter(job => job.id && job.title);
};

// Helper function to normalize job application data from backend
const normalizeApplication = (application: any): JobApplication => {
  // Extract job title from various possible locations
  const jobTitle = 
    application.jobTitle || 
    application.job_title || 
    application.Job?.title || 
    application.job?.title ||
    application.Job?.Title ||
    application.job?.Title ||
    (application.Job && typeof application.Job === 'object' ? application.Job.title || application.Job.Title : '') ||
    '';
  
  console.log('Normalizing application:', {
    original: application,
    extractedJobTitle: jobTitle,
    jobObject: application.Job || application.job
  });

  return {
    id: String(application.id || application._id || ''),
    jobId: String(application.jobId || application.job_id || application.JobId || application.Job?.id || application.job?.id || ''),
    userId: String(application.userId || application.user_id || application.UserId || application.User?.id || application.user?.id || ''),
    userName: application.userName || application.user_name || application.name || application.User?.name || application.user?.name || application.User?.Name || '',
    userEmail: application.userEmail || application.user_email || application.email || application.User?.email || application.user?.email || application.User?.Email || '',
    appliedAt: application.appliedAt || application.applied_at || application.createdAt || application.created_at || application.applied || application.created || '',
    jobTitle: jobTitle,
    status: (application.status || 'pending') as JobApplication['status'],
  };
};

// Helper function to normalize array of applications
const normalizeApplications = (applications: any[]): JobApplication[] => {
  if (!Array.isArray(applications)) {
    return [];
  }
  return applications.map(normalizeApplication).filter(app => app.id);
};

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: {
        token: string;
        user: {
          id: number;
          name: string;
          email: string;
          role: string;
        };
      };
    }>('/auth/login', credentials);
    
    // Transform backend response to frontend format
    // Normalize role to lowercase
    const normalizedRole = response.data.data.user.role.toLowerCase() as 'hr' | 'user';
    
    return {
      token: response.data.data.token,
      user: {
        id: response.data.data.user.id.toString(),
        email: response.data.data.user.email,
        name: response.data.data.user.name,
        role: normalizedRole,
      },
    };
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Jobs API
export const jobsAPI = {
  getAllJobs: async (): Promise<Job[]> => {
    try {
      const response = await api.get<any>('/jobs');
      const data = extractData<any[]>(response.data);
      return normalizeJobs(data);
    } catch (error) {
      console.error('Error fetching all jobs:', error);
      return [];
    }
  },
  getActiveJobs: async (): Promise<Job[]> => {
    try {
      const response = await api.get<any>('/jobs/active');
      const data = extractData<any[]>(response.data);
      const normalized = normalizeJobs(data);
      console.log('Active jobs fetched:', normalized);
      return normalized;
    } catch (error) {
      console.error('Error fetching active jobs:', error);
      return [];
    }
  },
  createJob: async (jobData: Omit<Job, 'id' | 'createdAt' | 'isActive' | 'isExpired'>): Promise<Job> => {
    const response = await api.post<any>('/jobs', jobData);
    const data = extractData<any>(response.data);
    return normalizeJob(data);
  },
  markAsExpired: async (jobId: string): Promise<Job> => {
    const response = await api.patch<any>(`/jobs/${jobId}/expire`);
    const data = extractData<any>(response.data);
    return normalizeJob(data);
  },
  applyToJob: async (jobId: string): Promise<JobApplication> => {
    const response = await api.post<any>(`/jobs/${jobId}/apply`);
    const data = extractData<any>(response.data);
    return normalizeApplication(data);
  },
};

// Applications API
export const applicationsAPI = {
  getAllApplications: async (): Promise<JobApplication[]> => {
    try {
      const response = await api.get<any>('/applications');
      const data = extractData<any[]>(response.data);
      console.log('Raw applications data from backend:', data);
      
      const normalized = normalizeApplications(data);
      console.log('Applications after normalization:', normalized);
      
      // If any application is missing jobTitle, try to fetch job details
      const applicationsWithTitles = await Promise.all(
        normalized.map(async (app) => {
          if (!app.jobTitle && app.jobId) {
            try {
              // Try to get job details to extract title
              const jobs = await jobsAPI.getAllJobs();
              const job = jobs.find(j => j.id === app.jobId);
              if (job) {
                console.log(`Found job title for application ${app.id}:`, job.title);
                return { ...app, jobTitle: job.title };
              }
            } catch (error) {
              console.warn(`Could not fetch job details for jobId ${app.jobId}:`, error);
            }
          }
          return app;
        })
      );
      
      console.log('Final applications with titles:', applicationsWithTitles);
      return applicationsWithTitles;
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Backend supports both /dashboard and /stats endpoints
      const response = await api.get<any>('/dashboard');
      console.log('Dashboard stats API response:', response.data);
      
      // Handle different response structures
      let data: any;
      if (response.data && typeof response.data === 'object') {
        // If response has data property, use it
        if ('data' in response.data && response.data.data) {
          data = response.data.data;
        } 
        // If response has the stats directly
        else if ('totalJobs' in response.data || 'expiredJobs' in response.data) {
          data = response.data;
        }
        // Use extractData as fallback
        else {
          data = extractData<DashboardStats>(response.data);
        }
      } else {
        data = extractData<DashboardStats>(response.data);
      }
      
      console.log('Extracted dashboard stats data:', data);
      
      // Ensure all stats are numbers, defaulting to 0 if undefined
      const stats: DashboardStats = {
        totalJobs: typeof data?.totalJobs === 'number' ? data.totalJobs : (Number(data?.totalJobs) || 0),
        totalApplications: typeof data?.totalApplications === 'number' ? data.totalApplications : (Number(data?.totalApplications) || 0),
        expiredJobs: typeof data?.expiredJobs === 'number' ? data.expiredJobs : (Number(data?.expiredJobs) || 0),
        totalResumes: typeof data?.totalResumes === 'number' ? data.totalResumes : (Number(data?.totalResumes) || 0),
      };
      
      console.log('Final dashboard stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback: calculate stats from jobs if API fails
      try {
        const allJobs = await jobsAPI.getAllJobs();
        const allApplications = await applicationsAPI.getAllApplications();
        const allResumes = await resumeAPI.getAllResumes();
        
        const expiredJobsCount = allJobs.filter(job => 
          job.expiry_status === 'expired' || job.isExpired
        ).length;
        
        const fallbackStats: DashboardStats = {
          totalJobs: allJobs.length,
          totalApplications: allApplications.length,
          expiredJobs: expiredJobsCount,
          totalResumes: allResumes.length,
        };
        
        console.log('Using fallback stats:', fallbackStats);
        return fallbackStats;
      } catch (fallbackError) {
        console.error('Error calculating fallback stats:', fallbackError);
        return {
          totalJobs: 0,
          totalApplications: 0,
          expiredJobs: 0,
          totalResumes: 0,
        };
      }
    }
  },
};

// Resume API
export const resumeAPI = {
  uploadResume: async (file: File, onUploadProgress?: (progress: number) => void): Promise<Resume> => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post<any>('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onUploadProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      },
    });
    return extractData<Resume>(response.data);
  },
  getAllResumes: async (): Promise<Resume[]> => {
    const response = await api.get<any>('/resumes');
    const data = extractData<Resume[]>(response.data);
    return Array.isArray(data) ? data : [];
  },
};

export default api;

