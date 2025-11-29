import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { SxProps, Theme } from '@mui/material';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const EmptyState = ({ icon, title, description, action, sx }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          ...sx,
        }}
      >
        <Box sx={{ mb: 2 }}>{icon}</Box>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mb: description ? 1 : 0 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        )}
        {action && <Box sx={{ mt: 3 }}>{action}</Box>}
      </Box>
    </motion.div>
  );
};

