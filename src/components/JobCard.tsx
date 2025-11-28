import { motion } from 'framer-motion';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { LocationOn, Business, AttachMoney, Schedule, Send, Block } from '@mui/icons-material';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onMarkExpired?: (jobId: string) => void;
  showApplyButton?: boolean;
  showExpireButton?: boolean;
  isApplying?: boolean;
  index?: number;
}

export const JobCard = ({
  job,
  onApply,
  onMarkExpired,
  showApplyButton = false,
  showExpireButton = false,
  isApplying = false,
  index = 0,
}: JobCardProps) => {
  // Safely check if expired - use expiry_status from API if available
  const expiryDate = job.expiryDate ? new Date(job.expiryDate) : null;
  const isValidDate = expiryDate && !isNaN(expiryDate.getTime());
  // Use expiry_status from API if available, otherwise fall back to isExpired or date check
  const isExpired = job.expiry_status === 'expired' || 
    job.isExpired || 
    (isValidDate && expiryDate! < new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      layout
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          boxShadow: isExpired ? '0 2px 4px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          opacity: isExpired ? 0.85 : 1,
          border: isExpired ? '2px solid #ffebee' : '1px solid #e0e0e0',
          bgcolor: isExpired ? '#fafafa' : 'white',
          position: 'relative',
          ...(isExpired && {
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              bgcolor: 'error.main',
              borderRadius: '3px 0 0 3px',
            },
          }),
          '&:hover': {
            boxShadow: isExpired ? '0 2px 8px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0,0,0,0.15)',
            transform: isExpired ? 'none' : 'translateY(-2px)',
            borderColor: isExpired ? '#ffebee' : 'primary.main',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: isExpired ? 'text.secondary' : 'text.primary',
                  lineHeight: 1.3,
                }}
              >
                {job.title}
              </Typography>
              {isExpired && (
                <Chip
                  label="Expired"
                  color="error"
                  size="small"
                  sx={{ 
                    mb: 1.5,
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: 'error.main',
                    },
                  }}
                  icon={<Block />}
                />
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2, flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Business sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {job.company || 'Company not specified'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {job.location || 'Location not specified'}
              </Typography>
            </Box>
            {job.salary && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <AttachMoney sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {job.salary}
                </Typography>
              </Box>
            )}
            {isValidDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Expires: {expiryDate!.toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Box>

          {job.description && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                mb: 2,
                color: 'text.secondary',
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flexGrow: 1,
              }}
            >
              {job.description}
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mt: 'auto',
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ flex: 1, minWidth: 200 }}>
              {showExpireButton && !isExpired && (
                <Button
                  size="medium"
                  variant="outlined"
                  color="error"
                  onClick={() => onMarkExpired?.(job.id)}
                  startIcon={<Block />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Mark as Filled
                </Button>
              )}
            </Box>
            {showApplyButton && !isExpired && (
              <Button
                size="medium"
                variant="contained"
                onClick={() => onApply?.(job.id)}
                disabled={isApplying}
                startIcon={<Send />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                {isApplying ? 'Applying...' : 'Apply Now'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
