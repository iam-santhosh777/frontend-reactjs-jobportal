import { useState, useEffect, useCallback } from 'react';
import { jobsAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import type { Job } from '../types';

interface UseJobsOptions {
  autoLoad?: boolean;
  filterExpired?: boolean;
}

export const useJobs = (options: UseJobsOptions = {}) => {
  const { autoLoad = true, filterExpired = false } = options;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const jobsData = await jobsAPI.getAllJobs();
      
      let filteredJobs = jobsData;
      if (filterExpired) {
        filteredJobs = jobsData.filter((job) => {
          const isExpired = job.expiry_status === 'expired' || job.isExpired;
          return !isExpired;
        });
      }
      
      setJobs(filteredJobs);
    } catch (err: any) {
      const errorMessage = 'Failed to load jobs';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filterExpired]);

  const loadActiveJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const activeJobs = await jobsAPI.getActiveJobs();
      
      const validJobs = activeJobs.filter((job) => {
        if (!job.id || !job.title) {
          return false;
        }
        const isExpired = job.expiry_status === 'expired' || job.isExpired;
        return !isExpired;
      });
      
      setJobs(validJobs);
    } catch (err: any) {
      const errorMessage = 'Failed to load jobs';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsExpired = useCallback(async (jobId: string) => {
    try {
      await jobsAPI.markAsExpired(jobId);
      toast.success('Job marked as expired');
      
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, isExpired: true, expiry_status: 'expired' as const } : job
        )
      );
      
      await loadJobs();
    } catch (err: any) {
      toast.error('Failed to mark job as expired');
      throw err;
    }
  }, [loadJobs]);

  const applyToJob = useCallback(async (jobId: string) => {
    try {
      await jobsAPI.applyToJob(jobId);
      toast.success('Application submitted successfully!');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to apply for job');
      throw err;
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadJobs();
    }

    const handleJobExpired = () => {
      loadJobs();
    };

    window.addEventListener('job-expired', handleJobExpired);
    return () => window.removeEventListener('job-expired', handleJobExpired);
  }, [autoLoad, loadJobs]);

  return {
    jobs,
    loading,
    error,
    loadJobs,
    loadActiveJobs,
    markAsExpired,
    applyToJob,
    setJobs,
  };
};

