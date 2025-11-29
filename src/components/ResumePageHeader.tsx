import { Box, Typography, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ResumePageHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export const ResumePageHeader = ({
  loading,
  onRefresh,
}: ResumePageHeaderProps) => {
  return (
    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: { xs: 1.5, sm: 1 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
          }}
        >
          Resume Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Refresh
        </Button>
      </Box>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
      >
        Upload and manage candidate resumes
      </Typography>
    </Box>
  );
};

