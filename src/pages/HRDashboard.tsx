import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { DashboardWidget } from '../components/DashboardWidget';
import { dashboardAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Typography, Box, Button, Paper } from '@mui/material';
import { Add, Work, Assignment, Schedule, Description } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { DashboardStats } from '../types';

export const HRDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalApplications: 0,
    expiredJobs: 0,
    totalResumes: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();

    // Listen for new applications via custom event
    const handleNewApplication = () => {
      loadData();
    };

    // Listen for job expiration events
    const handleJobExpired = () => {
      loadData();
    };

    window.addEventListener('new-application', handleNewApplication);
    window.addEventListener('job-expired', handleJobExpired);
    return () => {
      window.removeEventListener('new-application', handleNewApplication);
      window.removeEventListener('job-expired', handleJobExpired);
    };
  }, []);

  const loadData = async () => {
    try {
      const statsData = await dashboardAPI.getStats();
      setStats(statsData);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
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
          maxWidth: { xs: '100%', md: '1536px' },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header Section */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ 
                fontWeight: 700, 
                mb: 1, 
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                color: 'text.primary',
              }}
            >
              HR Dashboard
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Overview of your job portal activities
            </Typography>
          </Box>

          {/* Stats Widgets Grid */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: 'repeat(2, 1fr)', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(4, 1fr)' 
              },
              gap: { xs: 1, sm: 2, md: 3 },
              mb: { xs: 3, sm: 4 },
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', minHeight: { xs: '140px', sm: '160px', md: '180px' }, minWidth: 0, width: '100%' }}>
              <DashboardWidget
                title="Total Jobs Posted"
                value={stats.totalJobs}
                icon={<Work sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: 'primary.main' }} />}
                color="primary"
                index={0}
              />
            </Box>
            <Box sx={{ display: 'flex', minHeight: { xs: '140px', sm: '160px', md: '180px' }, minWidth: 0, width: '100%' }}>
              <DashboardWidget
                title="Total Applications"
                value={stats.totalApplications}
                icon={<Assignment sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: 'success.main' }} />}
                color="success"
                index={1}
              />
            </Box>
            <Box sx={{ display: 'flex', minHeight: { xs: '140px', sm: '160px', md: '180px' }, minWidth: 0, width: '100%' }}>
              <DashboardWidget
                title="Expired Jobs"
                value={stats.expiredJobs}
                icon={<Schedule sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: 'error.main' }} />}
                color="error"
                index={2}
              />
            </Box>
            <Box sx={{ display: 'flex', minHeight: { xs: '140px', sm: '160px', md: '180px' }, minWidth: 0, width: '100%' }}>
              <DashboardWidget
                title="Resumes Uploaded"
                value={stats.totalResumes}
                icon={<Description sx={{ fontSize: { xs: 32, sm: 36, md: 40 }, color: 'info.main' }} />}
                color="info"
                index={3}
              />
            </Box>
          </Box>

          {/* Quick Actions Section */}
          <Paper
            elevation={2}
            sx={{
              bgcolor: 'white',
              borderRadius: 3,
              p: { xs: 2, sm: 2.5, md: 4 },
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                color: 'text.primary',
              }}
            >
              Quick Actions
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: { xs: 1.5, sm: 2 }, 
                flexWrap: 'wrap',
                justifyContent: { xs: 'stretch', sm: 'flex-start' },
              }}
            >
              <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' }, width: { xs: '100%', sm: 'auto' } }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/hr/post-job')}
                    size="large"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.25 },
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      },
                    }}
                  >
                    Post New Job
                  </Button>
                </motion.div>
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' }, width: { xs: '100%', sm: 'auto' } }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Work />}
                    onClick={() => navigate('/hr/jobs')}
                    size="large"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.25 },
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    View All Jobs
                  </Button>
                </motion.div>
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' }, width: { xs: '100%', sm: 'auto' } }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Assignment />}
                    onClick={() => navigate('/hr/applications')}
                    size="large"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.25 },
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    View Applications
                  </Button>
                </motion.div>
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' }, width: { xs: '100%', sm: 'auto' } }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Description />}
                    onClick={() => navigate('/hr/resumes')}
                    size="large"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1, sm: 1.25 },
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    Upload Resumes
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Layout>
  );
};
