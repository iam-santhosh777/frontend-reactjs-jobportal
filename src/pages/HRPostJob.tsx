import { Layout } from '../components/Layout';
import { JobForm } from '../components/JobForm';
import { motion } from 'framer-motion';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const HRPostJob = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/hr/jobs');
  };

  const handleCancel = () => {
    navigate('/hr/jobs');
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
            >
              Post New Job
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create a new job posting to attract candidates
            </Typography>
          </Box>

          <Paper
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 3,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              bgcolor: 'background.paper',
            }}
          >
            <JobForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </Paper>
        </motion.div>
      </Container>
    </Layout>
  );
};

