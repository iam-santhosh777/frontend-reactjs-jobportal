import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paper,
  Typography,
  Button,
  Box,
  LinearProgress,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  Refresh,
  CheckCircle,
  Error as ErrorIcon,
  Close,
  Description,
} from '@mui/icons-material';
import { resumeAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { formatFileSize } from '../utils/fileUtils';
import type { Resume } from '../types';

interface FileUploadState {
  file: File;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'failed';
  resume?: Resume;
}

interface ResumeUploadProps {
  onUploadSuccess?: () => void;
}

export const ResumeUpload = ({ onUploadSuccess }: ResumeUploadProps) => {
  const [files, setFiles] = useState<FileUploadState[]>([]);

  const uploadFile = async (fileState: FileUploadState, index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: 'uploading', progress: 0 };
      return updated;
    });

    try {
      const resume = await resumeAPI.uploadResume(fileState.file, (progress) => {
        setFiles((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], progress };
          return updated;
        });
      });

      setFiles((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: 'success', progress: 100, resume };
        return updated;
      });

      toast.success(`Successfully uploaded ${fileState.file.name}`);
      
      // Call success callback if provided (after a short delay to ensure state is updated)
      if (onUploadSuccess) {
        setTimeout(() => {
          onUploadSuccess();
        }, 500);
      }
    } catch (error: any) {
      setFiles((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: 'failed' };
        return updated;
      });
      toast.error(`Failed to upload ${fileState.file.name}`);
    }
  };

  const retryUpload = (index: number) => {
    const fileState = files[index];
    if (fileState) {
      uploadFile(fileState, index);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileSelectAndUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: FileUploadState[] = selectedFiles.map((file) => ({
      file,
      progress: 0,
      status: 'idle' as const,
    }));

    const startIndex = files.length;
    setFiles((prev) => [...prev, ...newFiles]);

    // Upload files after state update
    setTimeout(() => {
      newFiles.forEach((fileState, localIndex) => {
        uploadFile(fileState, startIndex + localIndex);
      });
    }, 0);

    e.target.value = ''; // Reset input
  };

  // formatFileSize is imported from utils

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 1.5, sm: 2 }, 
        mb: { xs: 2, sm: 3 },
        flexWrap: { xs: 'wrap', sm: 'nowrap' }
      }}>
        <Box
          sx={{
            p: { xs: 1, sm: 1.5 },
            borderRadius: 2,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Description sx={{ color: 'primary.main', fontSize: { xs: 24, sm: 28 } }} />
        </Box>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            flex: 1,
            minWidth: 0,
          }}
        >
          Upload Resumes
        </Typography>
      </Box>

      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <input
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          id="resume-upload"
          type="file"
          multiple
          onChange={handleFileSelectAndUpload}
        />
        <label htmlFor="resume-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUpload />}
            size="medium"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: { xs: 2, sm: 2.5 },
              py: { xs: 1, sm: 1.125 },
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            }}
          >
            Select Files
          </Button>
        </label>
        <Typography 
          variant="caption" 
          display="block" 
          sx={{ 
            mt: { xs: 0.75, sm: 1 }, 
            color: 'text.secondary',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        >
          Supported formats: PDF, DOC, DOCX
        </Typography>
      </Box>

      <AnimatePresence>
        {files.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: { xs: 1.5, sm: 2 },
            width: '100%',
            overflow: 'hidden',
          }}>
            {files.map((fileState, index) => (
              <motion.div
                key={`${fileState.file.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    borderColor:
                      fileState.status === 'success'
                        ? 'success.main'
                        : fileState.status === 'failed'
                        ? 'error.main'
                        : 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: { xs: 1, sm: 0 },
                      mb: { xs: 0, sm: 1 },
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 0.75, sm: 1 }, 
                      flex: 1, 
                      minWidth: 0,
                      width: '100%',
                    }}>
                      <Description color="action" sx={{ fontSize: { xs: 18, sm: 20 }, flexShrink: 0 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                          }}
                        >
                          {fileState.file.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}
                        >
                          {formatFileSize(fileState.file.size)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: { xs: 0.5, sm: 1 },
                      flexShrink: 0,
                      width: { xs: '100%', sm: 'auto' },
                      justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                    }}>
                      {fileState.status === 'uploading' && (
                        <Chip
                          label={`${fileState.progress}%`}
                          size="small"
                          color="primary"
                          sx={{ 
                            minWidth: { xs: 50, sm: 60 },
                            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 },
                          }}
                        />
                      )}
                      {fileState.status === 'success' && (
                        <Chip
                          icon={<CheckCircle sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                          label="Success"
                          size="small"
                          color="success"
                          sx={{ 
                            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 },
                          }}
                        />
                      )}
                      {fileState.status === 'failed' && (
                        <Chip
                          icon={<ErrorIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                          label="Failed"
                          size="small"
                          color="error"
                          sx={{ 
                            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 },
                          }}
                        />
                      )}
                      {(fileState.status === 'success' || fileState.status === 'failed') && (
                        <IconButton
                          size="small"
                          onClick={() => removeFile(index)}
                          sx={{ 
                            ml: { xs: 0, sm: 1 },
                            width: { xs: 32, sm: 36 },
                            height: { xs: 32, sm: 36 },
                          }}
                        >
                          <Close sx={{ fontSize: { xs: 16, sm: 18 } }} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>

                  {fileState.status === 'uploading' && (
                    <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
                      <LinearProgress
                        variant="determinate"
                        value={fileState.progress}
                        sx={{
                          height: { xs: 6, sm: 8 },
                          borderRadius: 1,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 1,
                          },
                        }}
                      />
                    </Box>
                  )}

                  {fileState.status === 'failed' && (
                    <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
                      <Alert
                        severity="error"
                        sx={{ 
                          mb: 1,
                          fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                          '& .MuiAlert-action': {
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            paddingTop: { xs: 0, sm: 1 },
                          }
                        }}
                        action={
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Refresh sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                            onClick={() => retryUpload(index)}
                            sx={{ 
                              textTransform: 'none',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              py: { xs: 0.5, sm: 0.75 },
                              px: { xs: 1, sm: 1.5 },
                            }}
                          >
                            Retry
                          </Button>
                        }
                      >
                        Upload failed. Please try again.
                      </Alert>
                    </Box>
                  )}

                  {fileState.status === 'success' && (
                    <Alert 
                      severity="success" 
                      sx={{ 
                        mt: { xs: 1.5, sm: 1 },
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      }}
                    >
                      Upload successful!
                    </Alert>
                  )}
                </Paper>
              </motion.div>
            ))}
          </Box>
        )}
      </AnimatePresence>
    </Paper>
  );
};
