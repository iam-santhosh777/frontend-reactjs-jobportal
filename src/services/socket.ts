import { io, Socket } from 'socket.io-client';
import type { JobApplication, Job } from '../types';

// Socket URL from environment variables
// Derives from API URL (same host, different protocol)
// This function is called at runtime to ensure correct URL detection
const getSocketUrl = (): string => {
  const PRODUCTION_SOCKET_URL = 'https://backend-nodejs-jobportal-production.up.railway.app';
  const DEVELOPMENT_SOCKET_URL = 'http://localhost:3000';
  
  // Priority 1: Runtime check FIRST - if deployed to Vercel or any remote server (not localhost)
  // This MUST be checked first because it's the most reliable runtime indicator
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname.toLowerCase();
    const origin = window.location.origin.toLowerCase();
    
    // Explicitly check for Vercel domains
    const isVercel = hostname.includes('vercel.app') || 
                     hostname.includes('vercel.com') ||
                     origin.includes('vercel.app') ||
                     origin.includes('vercel.com');
    
    // Check if it's localhost or local network
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' ||
                       hostname.startsWith('192.168.') ||
                       hostname.startsWith('10.') ||
                       hostname.startsWith('172.') ||
                       hostname.includes('.local');
    
    // If it's Vercel OR any non-localhost domain, use production URL
    if (isVercel || !isLocalhost) {
      console.log('🌐 Runtime detection: Deployed environment detected for Socket', {
        hostname,
        origin,
        isVercel,
        isLocalhost,
        usingUrl: PRODUCTION_SOCKET_URL
      });
      return PRODUCTION_SOCKET_URL;
    }
  }
  
  // Priority 2: Explicitly set via environment variable
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  if (apiUrl) {
    // Extract base URL from API URL (remove /api suffix if present)
    const baseUrl = apiUrl.trim().replace(/\/api\/?$/, '');
    if (baseUrl) {
      console.log('✅ Using Socket URL from VITE_API_BASE_URL:', baseUrl);
      return baseUrl;
    }
  }
  
  // Priority 3: Check if we're in production build (build-time check)
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
    console.log('📦 Production build detected (build-time). Using Railway Socket URL:', PRODUCTION_SOCKET_URL);
    return PRODUCTION_SOCKET_URL;
  }
  
  // Priority 4: Development fallback (only for localhost)
  console.log('💻 Development mode. Using localhost Socket URL:', DEVELOPMENT_SOCKET_URL);
  return DEVELOPMENT_SOCKET_URL;
};

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Get socket URL dynamically at connection time to ensure it's correct
    const socketUrl = getSocketUrl();
    console.log('🔌 Connecting to Socket URL:', socketUrl);
    console.log('🌐 Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'N/A');

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewApplication(callback: (application: JobApplication) => void): void {
    if (this.socket) {
      this.socket.on('new-application', callback);
    }
  }

  offNewApplication(): void {
    if (this.socket) {
      this.socket.off('new-application');
    }
  }

  onJobExpired(callback: (job: Job) => void): void {
    if (this.socket) {
      this.socket.on('job-expired', callback);
    }
  }

  offJobExpired(): void {
    if (this.socket) {
      this.socket.off('job-expired');
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();

