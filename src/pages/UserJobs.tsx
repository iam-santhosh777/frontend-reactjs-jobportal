import { useState } from 'react';
import { Layout } from '../components/Layout';
import { JobCard } from '../components/JobCard';
import { useJobs } from '../hooks/useJobs';
import { motion } from 'framer-motion';
import { Box, Button } from '@mui/material';
import { Refresh, Work } from '@mui/icons-material';
import { PageHeader } from '../components/shared/PageHeader';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { EmptyState } from '../components/shared/EmptyState';

export const UserJobs = () => {
  const { jobs, loading, loadActiveJobs, applyToJob } = useJobs({ autoLoad: true, filterExpired: true });
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  const handleApply = async (jobId: string) => {
    try {
      setApplyingJobId(jobId);
      await applyToJob(jobId);
      await loadActiveJobs();
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <Layout>
      <Box
        sx={{ 
          width: '100%', 
          boxSizing: 'border-box',
          px: { xs: 1, sm: 2, md: 3 },
          mx: 'auto',
          maxWidth: { xs: '100%', sm: '600px', md: '1200px' },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%' }}
        >
          <PageHeader
            title="Available Jobs"
            description="Browse and apply to available job positions"
            action={
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadActiveJobs}
                disabled={loading}
                size="medium"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            }
          />

          {loading ? (
            <LoadingSpinner fullHeight />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={<Work sx={{ fontSize: { xs: 48, sm: 64 }, color: 'text.secondary' }} />}
              title="No active jobs available at the moment"
              description="Check back later for new opportunities"
            />
          ) : (
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: '1fr',
                  lg: '1fr',
                },
                gap: { xs: 1, sm: 1.5, md: 3 },
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {jobs.map((job, index) => (
                <Box key={job.id} sx={{ minWidth: 0, width: '100%' }}>
                  <JobCard
                    job={job}
                    onApply={handleApply}
                    showApplyButton={true}
                    isApplying={applyingJobId === job.id}
                    index={index}
                  />
                </Box>
              ))}
            </Box>
          )}
        </motion.div>
      </Box>
    </Layout>
  );
};
