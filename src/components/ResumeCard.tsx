import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import { Description } from '@mui/icons-material';
import { ResumeActions } from './resume/ResumeActions';
import { ResumeInfo } from './resume/ResumeInfo';
import type { Resume } from '../types';

interface ResumeCardProps {
  resume: Resume;
  onDownload: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
  downloadingId: string | number | null;
  deleting: boolean;
}

export const ResumeCard = ({
  resume,
  onDownload,
  onDelete,
  downloadingId,
  deleting,
}: ResumeCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 2,
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2, md: 2.5 },
          '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } },
        }}
      >
        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          {/* Filename */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: 1,
                minWidth: 0,
              }}
            >
              <Description color="action" sx={{ fontSize: 20, flexShrink: 0 }} />
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  wordBreak: 'break-word',
                }}
              >
                {resume.filename || resume.fileName || 'Unknown'}
              </Typography>
            </Box>
            <ResumeActions
              resume={resume}
              downloadingId={downloadingId}
              deleting={deleting}
              onDownload={onDownload}
              onDelete={onDelete}
              variant="card"
            />
          </Box>

          <Divider />

          <ResumeInfo resume={resume} variant="card" />
        </Stack>
      </CardContent>
    </Card>
  );
};

