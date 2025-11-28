import { Layout } from '../components/Layout';
import { JobApplicationList } from '../components/JobApplicationList';
import { motion } from 'framer-motion';
import { Container, Typography, Box } from '@mui/material';

export const HRApplications = () => {
  return (
    <Layout>
      <Container maxWidth="xl">
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
              Job Applications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage all job applications
            </Typography>
          </Box>

          <JobApplicationList />
        </motion.div>
      </Container>
    </Layout>
  );
};



