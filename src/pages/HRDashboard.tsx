import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { DashboardWidget } from '../components/DashboardWidget';
import { jobsAPI, dashboardAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Typography, Box, Grid, Button } from '@mui/material';
import { Add, Work, Assignment, Schedule, Description } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Job, DashboardStats } from '../types';

export const HRDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalApplications: 0,
    expiredJobs: 0,
    totalResumes: 0,
  });
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const statsData = await dashboardAPI.getStats();
      setStats(statsData);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
            >
              HR Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Overview of your job portal activities
            </Typography>
          </Box>

          {/* Stats Widgets */}
          <Grid 
            container 
            spacing={3} 
            sx={{ 
              mb: 4,
              '& .MuiGrid-item': {
                display: 'flex',
                height: { xs: 'auto', md: '180px' },
              }
            }}
          >
            <Grid item xs={12} sm={6} md={3}>
              <DashboardWidget
                title="Total Jobs Posted"
                value={stats.totalJobs}
                icon={<Work sx={{ fontSize: 40, color: 'primary.main' }} />}
                color="primary"
                index={0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardWidget
                title="Total Applications"
                value={stats.totalApplications}
                icon={<Assignment sx={{ fontSize: 40, color: 'success.main' }} />}
                color="success"
                index={1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardWidget
                title="Expired Jobs"
                value={stats.expiredJobs}
                icon={<Schedule sx={{ fontSize: 40, color: 'error.main' }} />}
                color="error"
                index={2}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardWidget
                title="Resumes Uploaded"
                value={stats.totalResumes}
                icon={<Description sx={{ fontSize: 40, color: 'info.main' }} />}
                color="info"
                index={3}
              />
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 3,
              p: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/hr/post-job')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Post New Job
              </Button>
              <Button
                variant="outlined"
                startIcon={<Work />}
                onClick={() => navigate('/hr/jobs')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                View All Jobs
              </Button>
              <Button
                variant="outlined"
                startIcon={<Assignment />}
                onClick={() => navigate('/hr/applications')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                View Applications
              </Button>
              <Button
                variant="outlined"
                startIcon={<Description />}
                onClick={() => navigate('/hr/resumes')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Upload Resumes
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Layout>
  );
};
