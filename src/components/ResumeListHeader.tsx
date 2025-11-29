import { Box, Typography } from '@mui/material';
import { Description } from '@mui/icons-material';

interface ResumeListHeaderProps {
  count: number;
}

export const ResumeListHeader = ({ count }: ResumeListHeaderProps) => {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, sm: 2 },
      }}
    >
      <Description
        sx={{
          fontSize: { xs: 24, sm: 28 },
          color: 'primary.main',
        }}
      />
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
        }}
      >
        All Resumes ({count})
      </Typography>
    </Box>
  );
};

