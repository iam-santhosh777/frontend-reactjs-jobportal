import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { ResumeUpload } from '../components/ResumeUpload';
import { resumeAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Download,
  Delete,
  Description,
  Refresh,
  Work,
  CalendarToday,
} from '@mui/icons-material';
import type { Resume } from '../types';

export const HRResumes = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);
  const [uploadKey, setUploadKey] = useState(0); // Key to force re-render of upload component

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const resumesData = await resumeAPI.getAllResumes();
      setResumes(resumesData);
    } catch (error: any) {
      toast.error('Failed to load resumes');
      console.error('Error loading resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (resume: Resume) => {
    setResumeToDelete(resume);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!resumeToDelete) return;

    try {
      setDeleting(true);
      console.log('Deleting resume with ID:', resumeToDelete.id);
      await resumeAPI.deleteResume(resumeToDelete.id);
      toast.success('Resume deleted successfully');
      setDeleteDialogOpen(false);
      setResumeToDelete(null);
      // Refresh the list after a short delay to ensure backend has processed
      setTimeout(() => {
        loadResumes();
      }, 500);
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Failed to delete resume';
      toast.error(errorMessage);
      // Don't close dialog on error so user can retry
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setResumeToDelete(null);
  };

  const handleDownload = async (resume: Resume) => {
    try {
      setDownloadingId(resume.id);
      const filename = resume.filename || resume.fileName || `resume-${resume.id}.pdf`;
      await resumeAPI.downloadResume(resume.id, filename);
      toast.success('Resume download started');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to download resume';
      toast.error(errorMessage);
      console.error('Error downloading resume:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handleUploadSuccess = () => {
    // Refresh resumes list after successful upload
    loadResumes();
    // Force re-render of upload component
    setUploadKey((prev) => prev + 1);
  };

  return (
    <Layout>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
              >
                Resume Management
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadResumes}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Refresh
              </Button>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Upload and manage candidate resumes
            </Typography>
          </Box>

          {/* Upload Section */}
          <Box sx={{ mb: 4 }}>
            <ResumeUpload key={uploadKey} onUploadSuccess={handleUploadSuccess} />
          </Box>

          {/* Resumes List Section */}
          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Description sx={{ fontSize: 28, color: 'primary.main' }} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                All Resumes ({resumes.length})
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : resumes.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                  No resumes uploaded yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload your first resume to get started
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Filename</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Job Title</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Uploaded</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resumes.map((resume) => (
                      <TableRow
                        key={resume.id}
                        sx={{
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Description color="action" />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {resume.filename || resume.fileName || 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {resume.jobTitle ? (
                            <Chip
                              icon={<Work />}
                              label={resume.jobTitle}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Not assigned
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={resume.status === 'uploaded' ? 'Uploaded' : resume.status}
                            size="small"
                            color={
                              resume.status === 'uploaded' || resume.status === 'success'
                                ? 'success'
                                : resume.status === 'failed'
                                ? 'error'
                                : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(resume.createdAt || resume.uploadedAt)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Tooltip title="Download Resume">
                              <span>
                                <IconButton
                                  color="primary"
                                  onClick={() => handleDownload(resume)}
                                  disabled={downloadingId === resume.id}
                                  size="small"
                                  sx={{
                                    '&:hover': {
                                      bgcolor: 'primary.light',
                                      color: 'primary.dark',
                                    },
                                  }}
                                >
                                  {downloadingId === resume.id ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <Download />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Delete Resume">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(resume)}
                                disabled={deleting}
                                size="small"
                                sx={{
                                  '&:hover': {
                                    bgcolor: 'error.light',
                                    color: 'error.dark',
                                  },
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
              Delete Resume
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete "{resumeToDelete?.filename || resumeToDelete?.fileName || 'this resume'}"?
                This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 1 }}>
              <Button
                onClick={handleDeleteCancel}
                disabled={deleting}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                color="error"
                variant="contained"
                disabled={deleting}
                startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Layout>
  );
};
