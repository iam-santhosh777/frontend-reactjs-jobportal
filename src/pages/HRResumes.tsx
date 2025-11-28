import { Layout } from '../components/Layout';
import { ResumeUpload } from '../components/ResumeUpload';
import { motion } from 'framer-motion';
import { Container, Typography, Box } from '@mui/material';

export const HRResumes = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
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
              Resume Uploads
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload and manage candidate resumes
            </Typography>
          </Box>

          <ResumeUpload />
        </motion.div>
      </Container>
    </Layout>
  );
};


