import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { UserDashboard } from './pages/UserDashboard';
import { UserJobs } from './pages/UserJobs';
import { HRDashboard } from './pages/HRDashboard';
import { HRJobs } from './pages/HRJobs';
import { HRPostJob } from './pages/HRPostJob';
import { HRApplications } from './pages/HRApplications';
import { HRResumes } from './pages/HRResumes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/jobs"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserJobs />
                </ProtectedRoute>
              }
            />
            
            {/* HR Routes */}
            <Route
              path="/hr/dashboard"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <HRDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/jobs"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <HRJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/post-job"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <HRPostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/applications"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <HRApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/resumes"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <HRResumes />
                </ProtectedRoute>
              }
            />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                padding: '16px',
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
