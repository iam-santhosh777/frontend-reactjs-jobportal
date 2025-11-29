import { Box, Typography } from '@mui/material';
import { Description } from '@mui/icons-material';

export const ResumeEmptyState = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 6, sm: 8 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Description
        sx={{
          fontSize: { xs: 48, sm: 64 },
          color: 'text.secondary',
          mb: 2,
        }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          fontWeight: 500,
          mb: 1,
          fontSize: { xs: '1rem', sm: '1.25rem' },
        }}
      >
        No resumes uploaded yet
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
      >
        Upload your first resume to get started
      </Typography>
    </Box>
  );
};

