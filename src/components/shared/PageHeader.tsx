import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const PageHeader = ({ title, description, action, sx }: PageHeaderProps) => {
  return (
    <Box
      sx={{
        mb: 4,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: description ? 1 : 0,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
          }}
        >
          {title}
        </Typography>
        {action}
      </Box>
      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          {description}
        </Typography>
      )}
    </Box>
  );
};

