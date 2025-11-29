import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import type { Resume } from '../types';

interface DeleteResumeDialogProps {
  open: boolean;
  resume: Resume | null;
  deleting: boolean;
  isMobile: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteResumeDialog = ({
  open,
  resume,
  deleting,
  isMobile,
  onClose,
  onConfirm,
}: DeleteResumeDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          m: { xs: 2, sm: 3 },
          width: { xs: 'calc(100% - 32px)', sm: 'auto' },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          pb: 1,
          fontSize: { xs: '1.125rem', sm: '1.25rem' },
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 },
        }}
      >
        Delete Resume
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        <DialogContentText
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
            wordBreak: 'break-word',
          }}
        >
          Are you sure you want to delete "
          {resume?.filename || resume?.fileName || 'this resume'}"? This
          action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          p: { xs: 2, sm: 2 },
          pt: 1,
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Button
          onClick={onClose}
          disabled={deleting}
          fullWidth={isMobile}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            m: 0,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={deleting}
          startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
          fullWidth={isMobile}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            m: 0,
          }}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

