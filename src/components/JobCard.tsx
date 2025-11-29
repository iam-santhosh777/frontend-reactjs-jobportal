import { motion } from 'framer-motion';
import { Card, CardContent, Typography, Button, Box, Chip, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { LocationOn, Business, Schedule, Send, Block } from '@mui/icons-material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
      style={{ width: '100%', minWidth: 0 }}
    >
      <Card
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: 2.5, sm: 3 },
          boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid',
          borderColor: isExpired ? 'rgba(211, 47, 47, 0.12)' : 'rgba(0, 0, 0, 0.08)',
          bgcolor: 'white',
          position: 'relative',
          minWidth: 0,
          overflow: 'hidden',
          ...(isExpired && {
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              bgcolor: 'error.main',
              borderRadius: '2.5px 0 0 2.5px',
              zIndex: 1,
            },
          }),
          '&:hover': {
            boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
            transform: 'translateY(-4px)',
            borderColor: isExpired ? 'rgba(211, 47, 47, 0.25)' : 'primary.main',
          },
        }}
      >
        <CardContent sx={{ 
          pt: { xs: 2, sm: 2.5 },
          px: { xs: 2, sm: 2.5 },
          pb: 0,
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          '&:last-child': { pb: 0 }
        }}>
          {/* Mark as Filled button - positioned at top right */}
          {showExpireButton && !isExpired && (
            <Box sx={{ position: 'absolute', top: { xs: 12, sm: 16 }, right: { xs: 12, sm: 16 }, zIndex: 2 }}>
              {isMobile ? (
                <IconButton
                  onClick={() => onMarkExpired?.(job.id)}
                  color="error"
                  size="small"
                  sx={{
                    bgcolor: 'error.light',
                    color: 'error.main',
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: 'error.main',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'error.main',
                      color: 'white',
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                    },
                  }}
                  aria-label="Mark as Filled"
                >
                  <Block sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }} />
                </IconButton>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => onMarkExpired?.(job.id)}
                  startIcon={<Block />}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2,
                    py: 0.75,
                    fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                    borderWidth: 1.5,
                    minWidth: 'auto',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderWidth: 1.5,
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
                    },
                  }}
                >
                  Mark as Filled
                </Button>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1.25, sm: 1.5 }, gap: 1.5, pr: { xs: showExpireButton && !isExpired ? 9 : 0, sm: showExpireButton && !isExpired ? 12 : 0 } }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: { xs: 0.75, sm: 1 },
                  fontSize: { xs: '1.125rem', sm: '1.375rem', md: '1.5rem' },
                  color: 'text.primary',
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  wordBreak: 'break-word',
                }}
              >
                {job.title}
              </Typography>
              {/* Reserve space for chip to maintain consistent height */}
              <Box sx={{ height: { xs: 28, sm: 32 }, display: 'flex', alignItems: 'center' }}>
                {isExpired && (
                  <Chip
                    label="Expired"
                    color="error"
                    size="small"
                    sx={{ 
                      mb: 0,
                      fontWeight: 600,
                      fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                      height: { xs: 24, sm: 26 },
                      '& .MuiChip-label': {
                        px: { xs: 1, sm: 1.5 },
                      },
                      '& .MuiChip-icon': {
                        color: 'error.main',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      },
                      bgcolor: 'error.light',
                      border: '1px solid',
                      borderColor: 'error.main',
                    }}
                    icon={<Block sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }} />}
                  />
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: { xs: 1, sm: 1.25 }, 
            mb: { xs: 1.25, sm: 1.5 }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.75, sm: 1 }, 
              flexWrap: 'nowrap',
            }}>
              <Business sx={{ 
                fontSize: { xs: 18, sm: 20, md: 22 }, 
                color: 'primary.main',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
              }} />
              <Typography 
                variant="body2" 
                color="text.primary"
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                  flex: 1,
                  minWidth: 0,
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                }}
              >
                {job.company || 'Company not specified'}
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 0.75, sm: 1 }, 
              flexWrap: 'nowrap',
            }}>
              <LocationOn sx={{ 
                fontSize: { xs: 18, sm: 20, md: 22 }, 
                color: 'primary.main',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
              }} />
              <Typography 
                variant="body2" 
                color="text.primary"
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                  flex: 1,
                  minWidth: 0,
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                }}
              >
                {job.location || 'Location not specified'}
              </Typography>
            </Box>
            {job.salary && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.75, sm: 1 }, 
                flexWrap: 'nowrap',
              }}>
                <Typography 
                  component="span"
                  sx={{ 
                    fontSize: { xs: 18, sm: 20, md: 22 }, 
                    color: 'primary.main',
                    flexShrink: 0,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    lineHeight: 1,
                  }}
                >
                  ₹
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.primary"
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    color: 'success.main',
                    flex: 1,
                    minWidth: 0,
                    wordBreak: 'break-word',
                    lineHeight: 1.5,
                  }}
                >
                  {job.salary}
                </Typography>
              </Box>
            )}
            {isValidDate && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.75, sm: 1 }, 
                flexWrap: 'nowrap',
              }}>
                <Schedule sx={{ 
                  fontSize: { xs: 18, sm: 20, md: 22 }, 
                  color: isExpired ? 'error.main' : 'primary.main',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                }} />
                <Typography 
                  variant="body2" 
                  color={isExpired ? 'error.main' : 'text.primary'}
                  sx={{ 
                    fontWeight: 500,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                    flex: 1,
                    minWidth: 0,
                    wordBreak: 'break-word',
                    lineHeight: 1.5,
                  }}
                >
                  Expires: {expiryDate!.toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Box>

          {job.description && (
            <Box sx={{ 
              mb: { xs: 1.25, sm: 1.5 },
            }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: { xs: 2, sm: 3 },
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                }}
              >
                {job.description}
              </Typography>
            </Box>
          )}

          {/* Button area - always rendered to maintain consistent height */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'row',
              gap: { xs: 1, sm: 1.5 },
              mt: 'auto',
              minHeight: { xs: 48, sm: 56 },
            }}
          >
            {showApplyButton && !isExpired ? (
              <>
                {isMobile ? (
                  <IconButton
                    onClick={() => onApply?.(job.id)}
                    disabled={isApplying}
                    color="primary"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: { xs: 44, sm: 48 },
                      height: { xs: 44, sm: 48 },
                      borderRadius: 1.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 16px rgba(25, 118, 210, 0.4)',
                      },
                      '&:disabled': {
                        bgcolor: 'action.disabledBackground',
                        color: 'action.disabled',
                      },
                    }}
                    aria-label={isApplying ? 'Applying...' : 'Apply Now'}
                  >
                    <Send sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }} />
                  </IconButton>
                ) : (
                  <Button
                    size="medium"
                    variant="contained"
                    onClick={() => onApply?.(job.id)}
                    disabled={isApplying}
                    startIcon={<Send />}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: { xs: 2.5, sm: 3 },
                      py: { xs: 1, sm: 1.25 },
                      fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 16px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {isApplying ? 'Applying...' : 'Apply Now'}
                  </Button>
                )}
              </>
            ) : null}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
