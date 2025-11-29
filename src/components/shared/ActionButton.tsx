import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';

interface ActionButtonProps extends ButtonProps {
  withAnimation?: boolean;
}

export const ActionButton = ({ withAnimation = true, children, ...props }: ActionButtonProps) => {
  const button = (
    <Button
      {...props}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );

  if (withAnimation) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {button}
      </motion.div>
    );
  }

  return button;
};

