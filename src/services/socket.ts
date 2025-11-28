import { io, Socket } from 'socket.io-client';
import type { JobApplication, Job } from '../types';

// Socket URL from environment variables
// Derives from API URL (same host, different protocol)
const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  if (apiUrl) {
    // Extract base URL from API URL (remove /api suffix if present)
    const baseUrl = apiUrl.replace(/\/api\/?$/, '');
    return baseUrl;
  }
  
  // Check if we're in production (build-time check)
  const isProductionBuild = import.meta.env.PROD || import.meta.env.MODE === 'production';
  
  // Runtime check: if deployed to Vercel or any remote server (not localhost)
  const isDeployed = typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1' &&
    !window.location.hostname.startsWith('192.168.') &&
    !window.location.hostname.startsWith('10.') &&
    !window.location.hostname.startsWith('172.');
  
  // If production build OR deployed to a remote server, use Railway URL
  if (isProductionBuild || isDeployed) {
    return 'https://backend-nodejs-jobportal-production.up.railway.app';
  }
  
  // Development fallback (only for localhost)
  return 'http://localhost:3000';
};

const SOCKET_URL = getSocketUrl();

// Log Socket URL for debugging
if (import.meta.env.DEV || (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'))) {
  console.log('🔌 Socket URL:', SOCKET_URL);
}

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
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

