import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { socketService } from '../services/socket';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import type { JobApplication } from '../types';

// Helper function to normalize application from socket (same as in api.ts)
const normalizeSocketApplication = (application: any): JobApplication => {
  // Extract job title from various possible locations
  const jobTitle = 
    application.jobTitle || 
    application.job_title || 
    application.Job?.title || 
    application.job?.title ||
    application.Job?.Title ||
    application.job?.Title ||
    (application.Job && typeof application.Job === 'object' ? application.Job.title || application.Job.Title : '') ||
    '';
  
  console.log('Normalizing socket application:', {
    original: application,
    extractedJobTitle: jobTitle,
    jobObject: application.Job || application.job
  });

  return {
    id: String(application.id || application._id || ''),
    jobId: String(application.jobId || application.job_id || application.JobId || application.Job?.id || application.job?.id || ''),
    userId: String(application.userId || application.user_id || application.UserId || application.User?.id || application.user?.id || ''),
    userName: application.userName || application.user_name || application.name || application.User?.name || application.user?.name || application.User?.Name || '',
    userEmail: application.userEmail || application.user_email || application.email || application.User?.email || application.user?.email || application.User?.Email || '',
    appliedAt: application.appliedAt || application.applied_at || application.createdAt || application.created_at || application.applied || application.created || '',
    jobTitle: jobTitle,
    status: (application.status || 'pending') as JobApplication['status'],
  };
};

interface SocketContextType {
  socket: any;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        socketService.connect(token);

        // Listen for new job applications (HR only)
        if (user?.role === 'hr') {
          socketService.onNewApplication((application: any) => {
            // Normalize the application data from socket
            const normalizedApplication = normalizeSocketApplication(application);
            const jobTitle = normalizedApplication.jobTitle || 'a job';
            toast.success(`New application received for ${jobTitle}`, {
              duration: 5000,
            });
            // Dispatch custom event for components to listen to
            window.dispatchEvent(
              new CustomEvent('new-application', { detail: normalizedApplication })
            );
          });
        }

        // Listen for job expiration (both HR and User)
        socketService.onJobExpired((job: any) => {
          const jobId = String(job.id || job._id || '');
          const jobTitle = job.title || job.Title || 'a job';
          
          if (user?.role === 'hr') {
            toast(`Job "${jobTitle}" has been expired`, {
              duration: 4000,
              icon: 'ℹ️',
            });
          } else {
            toast(`Job "${jobTitle}" is no longer available`, {
              duration: 4000,
              icon: '⚠️',
            });
          }
          
          // Dispatch custom event for components to listen to
          window.dispatchEvent(
            new CustomEvent('job-expired', { detail: { jobId, job } })
          );
        });

        return () => {
          socketService.offNewApplication();
          socketService.offJobExpired();
          socketService.disconnect();
        };
      }
    }
  }, [isAuthenticated, user?.role]);

  return (
    <SocketContext.Provider value={{ socket: socketService.getSocket() }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

