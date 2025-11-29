import { useState } from 'react';
import { Layout } from '../components/Layout';
import { ResumeUpload } from '../components/ResumeUpload';
import { ResumeList } from '../components/ResumeList';
import { DeleteResumeDialog } from '../components/DeleteResumeDialog';
import { PageHeader } from '../components/shared/PageHeader';
import { useResumes } from '../hooks/useResumes';
import { motion } from 'framer-motion';
import { Box, Paper, useMediaQuery, useTheme, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import type { Resume } from '../types';

export const HRResumes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const {
    resumes,
    loading,
    downloadingId,
    deleting,
    loadResumes,
    downloadResume,
    deleteResume,
  } = useResumes();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [uploadKey, setUploadKey] = useState(0);

  const handleDeleteClick = (resume: Resume) => {
    setResumeToDelete(resume);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!resumeToDelete) return;

    try {
      await deleteResume(resumeToDelete);
      setDeleteDialogOpen(false);
      setResumeToDelete(null);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setResumeToDelete(null);
  };

  const handleUploadSuccess = () => {
    loadResumes();
    setUploadKey((prev) => prev + 1);
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
            title="Resume Management"
            description="Upload and manage candidate resumes"
            action={
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadResumes}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  width: { xs: '100%', sm: 'auto' },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.25 },
                }}
              >
                Refresh
              </Button>
            }
          />

          {/* Upload Section */}
          <Box sx={{ mb: { xs: 2.5, sm: 3, md: 4 } }}>
            <ResumeUpload key={uploadKey} onUploadSuccess={handleUploadSuccess} />
          </Box>

          {/* Resumes List Section */}
          <Paper
            sx={{
              borderRadius: { xs: 2, sm: 3 },
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <ResumeList
              resumes={resumes}
              loading={loading}
              isDesktop={isDesktop}
              downloadingId={downloadingId}
              deleting={deleting}
              onDownload={downloadResume}
              onDelete={handleDeleteClick}
            />
          </Paper>

          {/* Delete Confirmation Dialog */}
          <DeleteResumeDialog
            open={deleteDialogOpen}
            resume={resumeToDelete}
            deleting={deleting}
            isMobile={isMobile}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
          />
        </motion.div>
      </Box>
    </Layout>
  );
};
