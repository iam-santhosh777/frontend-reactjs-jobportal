import { useState, useMemo } from 'react';
import type { Job } from '../types';

export type FilterType = 'all' | 'active' | 'expired';

export const useJobFilters = (jobs: Job[]) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredJobs = useMemo(() => {
    switch (filter) {
      case 'active':
        return jobs.filter((job) => {
          const isExpired = job.expiry_status === 'expired' || job.isExpired;
          return !isExpired;
        });
      case 'expired':
        return jobs.filter((job) => {
          const isExpired = job.expiry_status === 'expired' || job.isExpired;
          return isExpired;
        });
      default:
        return jobs;
    }
  }, [jobs, filter]);

  const activeCount = useMemo(() => {
    return jobs.filter((job) => {
      const isExpired = job.expiry_status === 'expired' || job.isExpired;
      return !isExpired;
    }).length;
  }, [jobs]);

  const expiredCount = useMemo(() => {
    return jobs.filter((job) => {
      const isExpired = job.expiry_status === 'expired' || job.isExpired;
      return isExpired;
    }).length;
  }, [jobs]);

  return {
    filter,
    setFilter,
    filteredJobs,
    activeCount,
    expiredCount,
  };
};

