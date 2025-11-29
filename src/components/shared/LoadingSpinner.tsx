import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  fullHeight?: boolean;
}

export const LoadingSpinner = ({ size = 60, fullHeight = false }: LoadingSpinnerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...(fullHeight && { minHeight: '50vh' }),
        ...(!fullHeight && { py: 8 }),
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

