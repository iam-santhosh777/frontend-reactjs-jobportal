import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Assignment, CheckCircle, Cancel, Visibility, HourglassEmpty } from '@mui/icons-material';
import { applicationsAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import type { JobApplication } from '../types';

export const JobApplicationList = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();

    // Listen for new applications
    const handleNewApplication = (event: CustomEvent) => {
      const newApplication = event.detail as JobApplication;
      if (newApplication && newApplication.id) {
        setApplications((prev) => {
          const exists = prev.some((app) => app.id === newApplication.id);
          if (exists) {
            return prev.map((app) => (app.id === newApplication.id ? newApplication : app));
          }
          return [newApplication, ...prev];
        });
      }
    };

    window.addEventListener('new-application', handleNewApplication as EventListener);
    return () => window.removeEventListener('new-application', handleNewApplication as EventListener);
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationsAPI.getAllApplications();
      const validApplications = Array.isArray(data) ? data : [];
      setApplications(validApplications);
    } catch (error: any) {
      toast.error('Failed to load applications');
      console.error('Error loading applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'reviewed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: JobApplication['status']) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle fontSize="small" />;
      case 'rejected':
        return <Cancel fontSize="small" />;
      case 'reviewed':
        return <Visibility fontSize="small" />;
      default:
        return <HourglassEmpty fontSize="small" />;
    }
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 100,
      hide: true,
    },
    { 
      field: 'jobTitle', 
      headerName: 'Job Title', 
      width: 200,
      flex: 1,
    },
    { 
      field: 'userName', 
      headerName: 'Applicant Name', 
      width: 180,
      flex: 1,
    },
    { 
      field: 'userEmail', 
      headerName: 'Applicant Email', 
      width: 220,
      flex: 1,
    },
    {
      field: 'appliedAt',
      headerName: 'Applied At',
      width: 200,
      flex: 1,
      valueFormatter: (value) => {
        if (!value) return 'Invalid Date';
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleString();
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          icon={getStatusIcon(params.value as JobApplication['status'])}
          label={params.value || 'pending'}
          color={getStatusColor(params.value as JobApplication['status'])}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
  ];

  const rows = applications.map((application) => ({
    id: application.id,
    jobTitle: application.jobTitle || 'N/A',
    userName: application.userName || 'N/A',
    userEmail: application.userEmail || 'N/A',
    appliedAt: application.appliedAt,
    status: application.status || 'pending',
  }));

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Assignment sx={{ color: 'primary.main', fontSize: 28 }} />
        </Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
          Job Applications
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              No applications received yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Applications will appear here when candidates apply
            </Typography>
          </Box>
        </motion.div>
      ) : (
        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 25, 50]}
            checkboxSelection
            sx={{ border: 0 }}
            disableRowSelectionOnClick
          />
        </Paper>
      )}
    </Paper>
  );
};
