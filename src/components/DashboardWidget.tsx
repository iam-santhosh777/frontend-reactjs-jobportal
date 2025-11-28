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
      style={{ height: '100%', width: '100%', display: 'flex' }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
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
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: colors.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
        
        <Box>
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
                mb: 1,
                color: colors.bg,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                minHeight: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
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
              fontSize: '0.875rem',
            }}
          >
            {title}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};
