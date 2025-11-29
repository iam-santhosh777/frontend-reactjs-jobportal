import { Box, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Download, Delete } from '@mui/icons-material';
import type { Resume } from '../../types';

interface ResumeActionsProps {
  resume: Resume;
  downloadingId: string | number | null;
  deleting: boolean;
  onDownload: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
  variant?: 'card' | 'table';
}

export const ResumeActions = ({
  resume,
  downloadingId,
  deleting,
  onDownload,
  onDelete,
  variant = 'card',
}: ResumeActionsProps) => {
  const isDownloading = downloadingId === resume.id;

  if (variant === 'table') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <Tooltip title="Download Resume">
          <span>
            <IconButton
              color="primary"
              onClick={() => onDownload(resume)}
              disabled={isDownloading}
              size="small"
              sx={{
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: 'primary.dark',
                },
              }}
            >
              {isDownloading ? <CircularProgress size={20} /> : <Download />}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Delete Resume">
          <IconButton
            color="error"
            onClick={() => onDelete(resume)}
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
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        flexShrink: 0,
      }}
    >
      <Tooltip title="Download Resume">
        <span>
          <IconButton
            color="primary"
            onClick={() => onDownload(resume)}
            disabled={isDownloading}
            size="small"
            sx={{
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'primary.dark',
              },
            }}
          >
            {isDownloading ? <CircularProgress size={20} /> : <Download />}
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Delete Resume">
        <IconButton
          color="error"
          onClick={() => onDelete(resume)}
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
  );
};

