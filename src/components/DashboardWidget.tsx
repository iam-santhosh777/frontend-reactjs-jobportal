import { motion } from 'framer-motion';
import { Paper, Typography, Box } from '@mui/material';

interface DashboardWidgetProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  index?: number;
}

export const DashboardWidget = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  index = 0 
}: DashboardWidgetProps) => {
  const colorMap = {
    primary: { bg: '#1976d2', light: '#e3f2fd' },
    secondary: { bg: '#9c27b0', light: '#f3e5f5' },
    success: { bg: '#2e7d32', light: '#e8f5e9' },
    error: { bg: '#d32f2f', light: '#ffebee' },
    warning: { bg: '#ed6c02', light: '#fff3e0' },
    info: { bg: '#0288d1', light: '#e1f5fe' },
  };

  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ height: '100%', width: '100%', display: 'flex', minWidth: 0 }}
    >
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: 3,
          borderLeft: `4px solid ${colors.bg}`,
          bgcolor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {/* Icon at the top */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            mb: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <Box
            sx={{
              p: { xs: 1.5, sm: 1.75, md: 2 },
              borderRadius: 2,
              bgcolor: colors.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 48, sm: 56, md: 64 },
              height: { xs: 48, sm: 56, md: 64 },
            }}
          >
            {icon}
          </Box>
        </Box>
        
        {/* Value and Title at the bottom */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
          >
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontWeight: 700,
                mb: { xs: 1, sm: 1.5 },
                color: colors.bg,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {typeof value === 'number' ? value : 0}
            </Typography>
          </motion.div>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              letterSpacing: '0.02em',
              lineHeight: 1.4,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};
