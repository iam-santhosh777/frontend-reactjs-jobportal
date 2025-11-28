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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

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
          <Description sx={{ color: 'primary.main', fontSize: 28 }} />
        </Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
          Upload Resumes
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
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
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
            }}
          >
            Select Files
          </Button>
        </label>
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
          Supported formats: PDF, DOC, DOCX
        </Typography>
      </Box>

      <AnimatePresence>
        {files.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    p: 2,
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
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                      <Description color="action" />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {fileState.file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(fileState.file.size)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {fileState.status === 'uploading' && (
                        <Chip
                          label={`${fileState.progress}%`}
                          size="small"
                          color="primary"
                          sx={{ minWidth: 60 }}
                        />
                      )}
                      {fileState.status === 'success' && (
                        <Chip
                          icon={<CheckCircle />}
                          label="Success"
                          size="small"
                          color="success"
                        />
                      )}
                      {fileState.status === 'failed' && (
                        <Chip
                          icon={<ErrorIcon />}
                          label="Failed"
                          size="small"
                          color="error"
                        />
                      )}
                      {(fileState.status === 'success' || fileState.status === 'failed') && (
                        <IconButton
                          size="small"
                          onClick={() => removeFile(index)}
                          sx={{ ml: 1 }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>

                  {fileState.status === 'uploading' && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={fileState.progress}
                        sx={{
                          height: 8,
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
                    <Box sx={{ mt: 2 }}>
                      <Alert
                        severity="error"
                        sx={{ mb: 1 }}
                        action={
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={() => retryUpload(index)}
                            sx={{ textTransform: 'none' }}
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
                    <Alert severity="success" sx={{ mt: 1 }}>
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
