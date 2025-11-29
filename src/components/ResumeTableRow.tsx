import {
  TableRow,
  TableCell,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Description, Work, CalendarToday } from '@mui/icons-material';
import { StatusChip } from './shared/StatusChip';
import { ResumeActions } from './resume/ResumeActions';
import { formatDate } from '../utils/dateUtils';
import type { Resume } from '../types';

interface ResumeTableRowProps {
  resume: Resume;
  onDownload: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
  downloadingId: string | number | null;
  deleting: boolean;
}

export const ResumeTableRow = ({
  resume,
  onDownload,
  onDelete,
  downloadingId,
  deleting,
}: ResumeTableRowProps) => {
  return (
    <TableRow
      sx={{
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <TableCell>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Description
            color="action"
            sx={{ fontSize: { xs: 18, sm: 20 } }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              wordBreak: 'break-word',
            }}
          >
            {resume.filename || resume.fileName || 'Unknown'}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        {resume.jobTitle ? (
          <Chip
            icon={<Work sx={{ fontSize: 16 }} />}
            label={resume.jobTitle}
            size="small"
            color="primary"
            variant="outlined"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              '& .MuiChip-label': {
                px: { xs: 0.5, sm: 1 },
              },
            }}
          />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            Not assigned
          </Typography>
        )}
      </TableCell>
      <TableCell>
        <StatusChip status={resume.status} />
      </TableCell>
      <TableCell>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <CalendarToday
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: 'text.secondary',
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            {formatDate(resume.createdAt || resume.uploadedAt)}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <ResumeActions
          resume={resume}
          downloadingId={downloadingId}
          deleting={deleting}
          onDownload={onDownload}
          onDelete={onDelete}
          variant="table"
        />
      </TableCell>
    </TableRow>
  );
};

