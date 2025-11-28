import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { JobCard } from '../components/JobCard';
import { JobForm } from '../components/JobForm';
import { jobsAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent, Tabs, Tab, Chip } from '@mui/material';
import { Add, Work, Block, CheckCircle } from '@mui/icons-material';
import type { Job } from '../types';

type FilterType = 'all' | 'active' | 'expired';

export const HRJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadJobs();

    // Listen for job expiration events
    const handleJobExpired = () => {
      loadJobs();
    };

    window.addEventListener('job-expired', handleJobExpired);
    return () => window.removeEventListener('job-expired', handleJobExpired);
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await jobsAPI.getAllJobs();
      setJobs(jobsData);
      applyFilter(jobsData, filter);
    } catch (error: any) {
      toast.error('Failed to load jobs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (jobsList: Job[], filterType: FilterType) => {
    let filtered: Job[] = [];
    
    switch (filterType) {
      case 'active':
        filtered = jobsList.filter((job) => {
          // Use expiry_status from API if available, otherwise fall back to isExpired
          const isExpired = job.expiry_status === 'expired' || job.isExpired;
          return !isExpired;
        });
        break;
      case 'expired':
        filtered = jobsList.filter((job) => {
          // Use expiry_status from API if available, otherwise fall back to isExpired
          const isExpired = job.expiry_status === 'expired' || job.isExpired;
          return isExpired;
        });
        break;
      default:
        filtered = jobsList;
    }
    
    setFilteredJobs(filtered);
  };

  useEffect(() => {
    applyFilter(jobs, filter);
  }, [filter, jobs]);

  const handleCreateJob = async () => {
    setJobFormOpen(false);
    await loadJobs();
  };

  const handleMarkExpired = async (jobId: string) => {
    try {
      await jobsAPI.markAsExpired(jobId);
      toast.success('Job marked as expired');
      
      // Update the job immediately in the state
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, isExpired: true, expiry_status: 'expired' as const } : job
        )
      );
      
      // Reload to get updated data from server
      await loadJobs();
    } catch (error: any) {
      toast.error('Failed to mark job as expired');
    }
  };

  const handleFilterChange = (_event: React.SyntheticEvent, newValue: FilterType) => {
    setFilter(newValue);
  };

  return (
    <Layout>
      <Container maxWidth="xl">
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
              mb: 3,
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
                Job Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage all your job postings
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setJobFormOpen(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Post New Job
            </Button>
          </Box>

          {/* Filter Tabs */}
          <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={filter}
              onChange={handleFilterChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 48,
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>All Jobs</span>
                    <Chip
                      label={jobs.length}
                      size="small"
                      sx={{ height: 20, fontSize: '0.75rem' }}
                    />
                  </Box>
                }
                value="all"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 18 }} />
                    <span>Active</span>
                    <Chip
                      label={jobs.filter((job) => {
                        const isExpired = job.expiry_status === 'expired' || job.isExpired;
                        return !isExpired;
                      }).length}
                      size="small"
                      color="success"
                      sx={{ height: 20, fontSize: '0.75rem' }}
                    />
                  </Box>
                }
                value="active"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Block sx={{ fontSize: 18 }} />
                    <span>Expired</span>
                    <Chip
                      label={jobs.filter((job) => {
                        const isExpired = job.expiry_status === 'expired' || job.isExpired;
                        return isExpired;
                      }).length}
                      size="small"
                      color="error"
                      sx={{ height: 20, fontSize: '0.75rem' }}
                    />
                  </Box>
                }
                value="expired"
              />
            </Tabs>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Work sx={{ fontSize: 48, color: 'primary.main' }} />
              </motion.div>
            </Box>
          ) : filteredJobs.length === 0 ? (
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
                {filter === 'expired' ? (
                  <>
                    <Block sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                      No expired jobs
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      All jobs are currently active
                    </Typography>
                  </>
                ) : filter === 'active' ? (
                  <>
                    <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                      No active jobs
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      All jobs have expired or no jobs posted yet
                    </Typography>
                  </>
                ) : (
                  <>
                    <Work sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                      No jobs posted yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                      Create your first job posting to get started
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setJobFormOpen(true)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Post New Job
                    </Button>
                  </>
                )}
              </Box>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {filteredJobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onMarkExpired={handleMarkExpired}
                    showExpireButton={!job.isExpired}
                    index={index}
                  />
                ))}
              </Box>
            </AnimatePresence>
          )}

          {/* Job Form Dialog */}
          <Dialog
            open={jobFormOpen}
            onClose={() => setJobFormOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              },
            }}
          >
            <DialogTitle 
              sx={{ 
                fontWeight: 700, 
                pb: 1,
                pt: 3,
                px: 3,
                fontSize: '1.5rem',
              }}
            >
              Post New Job
            </DialogTitle>
            <Box sx={{ px: 3, pb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create a new job posting to attract candidates
              </Typography>
            </Box>
            <DialogContent sx={{ px: 3, pb: 3 }}>
              <JobForm onSuccess={handleCreateJob} onCancel={() => setJobFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </motion.div>
      </Container>
    </Layout>
  );
};

