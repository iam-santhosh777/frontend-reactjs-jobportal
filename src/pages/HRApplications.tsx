import { Layout } from '../components/Layout';
import { JobApplicationList } from '../components/JobApplicationList';
import { PageHeader } from '../components/shared/PageHeader';
import { motion } from 'framer-motion';
import { Container } from '@mui/material';

export const HRApplications = () => {
  return (
    <Layout>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <PageHeader
            title="Job Applications"
            description="View and manage all job applications"
          />

          <JobApplicationList />
        </motion.div>
      </Container>
    </Layout>
  );
};




