import { useState, useEffect, useCallback } from 'react';
import { resumeAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import type { Resume } from '../types';

export const useResumes = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadResumes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const resumesData = await resumeAPI.getAllResumes();
      setResumes(resumesData);
    } catch (err: any) {
      const errorMessage = 'Failed to load resumes';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading resumes:', err);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadResume = useCallback(async (resume: Resume) => {
    try {
      setDownloadingId(resume.id);
      const filename = resume.filename || resume.fileName || `resume-${resume.id}.pdf`;
      await resumeAPI.downloadResume(resume.id, filename);
      toast.success('Resume download started');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to download resume';
      toast.error(errorMessage);
      console.error('Error downloading resume:', err);
      throw err;
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const deleteResume = useCallback(async (resume: Resume) => {
    try {
      setDeleting(true);
      console.log('Deleting resume with ID:', resume.id);
      await resumeAPI.deleteResume(resume.id);
      toast.success('Resume deleted successfully');
      
      setTimeout(() => {
        loadResumes();
      }, 500);
      
      return true;
    } catch (err: any) {
      console.error('Error deleting resume:', err);
      const errorMessage = err.message || err.response?.data?.message || 'Failed to delete resume';
      toast.error(errorMessage);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, [loadResumes]);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  return {
    resumes,
    loading,
    error,
    downloadingId,
    deleting,
    loadResumes,
    downloadResume,
    deleteResume,
    setResumes,
  };
};

