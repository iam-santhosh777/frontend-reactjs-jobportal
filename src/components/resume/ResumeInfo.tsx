import { Box, Typography, Chip } from '@mui/material';
import { Work, CalendarToday } from '@mui/icons-material';
import { StatusChip } from '../shared/StatusChip';
import { formatDate } from '../../utils/dateUtils';
import type { Resume } from '../../types';

interface ResumeInfoProps {
  resume: Resume;
  variant?: 'card' | 'table';
}

export const ResumeInfo = ({ resume, variant = 'card' }: ResumeInfoProps) => {
  if (variant === 'table') {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
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
        </Box>
        <StatusChip status={resume.status} />
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
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            minWidth: { xs: '80px', sm: '90px' },
          }}
        >
          Job Title:
        </Typography>
        {resume.jobTitle ? (
          <Chip
            icon={<Work sx={{ fontSize: 14 }} />}
            label={resume.jobTitle}
            size="small"
            color="primary"
            variant="outlined"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
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
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            minWidth: { xs: '80px', sm: '90px' },
          }}
        >
          Status:
        </Typography>
        <StatusChip status={resume.status} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            minWidth: { xs: '80px', sm: '90px' },
          }}
        >
          Uploaded:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <CalendarToday
            sx={{
              fontSize: 14,
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
      </Box>
    </>
  );
};

