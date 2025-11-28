import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { JobCard } from '../components/JobCard';
import { jobsAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Container, Typography, Box, CircularProgress, Button } from '@mui/material';
import { Refresh, Work } from '@mui/icons-material';
import type { Job } from '../types';

export const UserDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();

    // Listen for job expiration events via WebSocket
    const handleJobExpired = (event: CustomEvent) => {
      const { jobId } = event.detail;
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    };

    window.addEventListener('job-expired', handleJobExpired as EventListener);
    return () => window.removeEventListener('job-expired', handleJobExpired as EventListener);
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const activeJobs = await jobsAPI.getActiveJobs();
      console.log('Loaded active jobs:', activeJobs);

      // Filter out expired jobs using expiry_status from API
      const validJobs = activeJobs.filter((job) => {
        if (!job.id || !job.title) {
          console.warn('Invalid job data - missing id or title:', job);
          return false;
        }

        // Use expiry_status from API if available, otherwise fall back to isExpired
        const isExpired = job.expiry_status === 'expired' || job.isExpired;
        return !isExpired;
      });

      setJobs(validJobs);
    } catch (error: any) {
      toast.error('Failed to load jobs');
      console.error('Error loading jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      setApplyingJobId(jobId);
      await jobsAPI.applyToJob(jobId);
      toast.success('Application submitted successfully!');
      // Reload jobs to reflect any changes
      await loadJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplyingJobId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
              >
                Available Jobs
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Browse and apply to available job positions
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadJobs}
              disabled={loading}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </Box>

          {jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  bgcolor: 'white',
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Work sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                  No active jobs available at the moment
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Check back later for new opportunities
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <Box>
              {jobs.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  showApplyButton={true}
                  isApplying={applyingJobId === job.id}
                  index={index}
                />
              ))}
            </Box>
          )}
        </motion.div>
      </Container>
    </Layout>
  );
};
