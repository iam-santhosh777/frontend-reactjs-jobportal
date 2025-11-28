import { io, Socket } from 'socket.io-client';
import type { JobApplication, Job } from '../types';

// Socket URL - Detect environment at runtime
const getSocketUrl = (): string => {
  // Check if we're running in development (localhost)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname.toLowerCase();
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' ||
                       hostname.startsWith('192.168.') ||
                       hostname.startsWith('10.') ||
                       hostname.startsWith('172.') ||
                       hostname.includes('.local');
    
    if (isLocalhost) {
      return 'http://localhost:3000';
    }
  }
  
  // Production: Use Railway URL
  return 'https://backend-nodejs-jobportal-production.up.railway.app';
};

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Get socket URL dynamically based on environment
    const socketUrl = getSocketUrl();
    console.log('🔌 Connecting to Socket URL:', socketUrl);
    console.log('🌐 Environment:', typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'Development' : 'Production');

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

