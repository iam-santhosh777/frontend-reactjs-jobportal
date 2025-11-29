import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { CheckCircle, Error as ErrorIcon, HourglassEmpty } from '@mui/icons-material';

type StatusType = 'success' | 'error' | 'warning' | 'default' | 'info';

interface StatusChipProps extends Omit<ChipProps, 'color' | 'icon'> {
  status: string;
  label?: string;
  size?: 'small' | 'medium';
}

const getStatusConfig = (status: string): { color: StatusType; icon?: React.ReactElement; label: string } => {
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus === 'uploaded' || normalizedStatus === 'success' || normalizedStatus === 'accepted') {
    return {
      color: 'success',
      icon: <CheckCircle sx={{ fontSize: 14 }} /> as React.ReactElement,
      label: normalizedStatus === 'uploaded' ? 'Uploaded' : status,
    };
  }
  
  if (normalizedStatus === 'failed' || normalizedStatus === 'rejected') {
    return {
      color: 'error',
      icon: <ErrorIcon sx={{ fontSize: 14 }} /> as React.ReactElement,
      label: status,
    };
  }
  
  if (normalizedStatus === 'reviewed') {
    return {
      color: 'info',
      icon: <HourglassEmpty sx={{ fontSize: 14 }} /> as React.ReactElement,
      label: status,
    };
  }
  
  return {
    color: 'default',
    label: status,
  };
};

export const StatusChip = ({ status, label, size = 'small', ...props }: StatusChipProps) => {
  const config = getStatusConfig(status);
  
  return (
    <Chip
      icon={config.icon}
      label={label || config.label}
      color={config.color}
      size={size}
      sx={{
        fontSize: { xs: '0.7rem', sm: '0.75rem' },
        ...props.sx,
      }}
      {...props}
    />
  );
};

