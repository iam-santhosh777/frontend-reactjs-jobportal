import { useState } from 'react';
import { Layout } from '../components/Layout';
import { JobCard } from '../components/JobCard';
import { JobForm } from '../components/JobForm';
import { useJobs } from '../hooks/useJobs';
import { useJobFilters } from '../hooks/useJobFilters';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Button, Dialog, DialogTitle, DialogContent, Tabs, Tab, Chip, Typography } from '@mui/material';
import { Add, Work, Block, CheckCircle } from '@mui/icons-material';
import { PageHeader } from '../components/shared/PageHeader';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { EmptyState } from '../components/shared/EmptyState';

export const HRJobs = () => {
  const { jobs, loading, loadJobs, markAsExpired } = useJobs({ autoLoad: true });
  const { filter, setFilter, filteredJobs, activeCount, expiredCount } = useJobFilters(jobs);
  const [jobFormOpen, setJobFormOpen] = useState(false);

  const handleCreateJob = async () => {
    setJobFormOpen(false);
    await loadJobs();
  };

  const handleMarkExpired = async (jobId: string) => {
    try {
      await markAsExpired(jobId);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleFilterChange = (_event: React.SyntheticEvent, newValue: typeof filter) => {
    setFilter(newValue);
  };

  return (
    <Layout>
      <Box
        sx={{
          width: '100%',
          px: { xs: 1, sm: 2, md: 3 },
          mx: 'auto',
          maxWidth: { xs: '100%', sm: '100%', md: '1536px' },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <PageHeader
            title="Job Management"
            description="Manage all your job postings"
            action={
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
            }
          />

          {/* Filter Tabs */}
          <Box sx={{ mb: { xs: 3, sm: 4 }, borderBottom: 1, borderColor: 'divider', overflowX: 'auto' }}>
            <Tabs
              value={filter}
              onChange={handleFilterChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: { xs: 44, sm: 48 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 1.5, sm: 2 },
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
                      label={activeCount}
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
                      label={expiredCount}
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
            <LoadingSpinner />
          ) : filteredJobs.length === 0 ? (
            filter === 'expired' ? (
              <EmptyState
                icon={<Block sx={{ fontSize: 64, color: 'text.secondary' }} />}
                title="No expired jobs"
                description="All jobs are currently active"
              />
            ) : filter === 'active' ? (
              <EmptyState
                icon={<CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />}
                title="No active jobs"
                description="All jobs have expired or no jobs posted yet"
              />
            ) : (
              <EmptyState
                icon={<Work sx={{ fontSize: 64, color: 'text.secondary' }} />}
                title="No jobs posted yet"
                description="Create your first job posting to get started"
                action={
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
                }
              />
            )
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
                  gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
                  width: '100%',
                }}
              >
                {filteredJobs.map((job, index) => (
                  <Box key={job.id} sx={{ minWidth: 0, width: '100%' }}>
                    <JobCard
                      job={job}
                      onMarkExpired={handleMarkExpired}
                      showExpireButton={!job.isExpired}
                      index={index}
                    />
                  </Box>
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
      </Box>
    </Layout>
  );
};

