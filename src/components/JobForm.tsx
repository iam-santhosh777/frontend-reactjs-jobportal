import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TextField, 
  Button, 
  Box, 
  Typography,
  InputAdornment,
  FormHelperText,
} from '@mui/material';
import { Send, Cancel, CalendarToday, Work, Business, LocationOn, AttachMoney, Description } from '@mui/icons-material';
import { jobsAPI } from '../services/api';
import { toast } from 'react-hot-toast';

interface JobFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const JobForm = ({ onSuccess, onCancel }: JobFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    expiryDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await jobsAPI.createJob({
        ...formData,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : '',
      });
      toast.success('Job posted successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Job Title */}
        <Box>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TextField
              fullWidth
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Senior Software Engineer"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 2,
                    },
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
            />
            <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
              <Typography component="span" variant="caption" color="text.secondary">
                *
              </Typography>
            </FormHelperText>
          </motion.div>
        </Box>

        {/* Company and Location */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          {/* Company */}
          <Box sx={{ flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="e.g., Tech Corp"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 2,
                    },
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
            />
            <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
              <Typography component="span" variant="caption" color="text.secondary">
                *
              </Typography>
            </FormHelperText>
          </motion.div>
          </Box>

          {/* Location */}
          <Box sx={{ flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., New York, NY"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 2,
                    },
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
            />
            <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
              <Typography component="span" variant="caption" color="text.secondary">
                *
              </Typography>
            </FormHelperText>
          </motion.div>
          </Box>
        </Box>

        {/* Salary and Expiry Date */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          {/* Salary */}
          <Box sx={{ flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TextField
              fullWidth
              label="Salary (Optional)"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., $50,000 - $70,000"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 2,
                    },
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
            />
          </motion.div>
          </Box>

          {/* Expiry Date */}
          <Box sx={{ flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TextField
              fullWidth
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 1 }}>
                    <CalendarToday sx={{ color: 'text.secondary', pointerEvents: 'none' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 2,
                    },
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
                '& input[type="date"]': {
                  '&::-webkit-calendar-picker-indicator': {
                    cursor: 'pointer',
                    opacity: 1,
                    marginLeft: 0,
                  },
                },
              }}
            />
            <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
              <Typography component="span" variant="caption" color="text.secondary">
                *
              </Typography>
            </FormHelperText>
          </motion.div>
          </Box>
        </Box>

        {/* Job Description */}
        <Box>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <TextField
              fullWidth
              label="Job Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={6}
              placeholder="Describe the job responsibilities, requirements, and benefits..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <Description sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 2,
                    },
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
                '& .MuiInputAdornment-root': {
                  alignItems: 'flex-start',
                },
              }}
            />
            <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
              <Typography component="span" variant="caption" color="text.secondary">
                *
              </Typography>
            </FormHelperText>
          </motion.div>
        </Box>

        {/* Action Buttons */}
        <Box>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end', 
              mt: 2,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onCancel}
                disabled={loading}
                variant="outlined"
                startIcon={<Cancel />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.25,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Cancel
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<Send />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.25,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                }}
              >
                {loading ? 'Posting...' : 'Post Job'}
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
