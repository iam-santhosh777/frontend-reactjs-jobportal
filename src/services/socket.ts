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
  // Fallback to localhost
  return 'http://localhost:3000';
};

const SOCKET_URL = getSocketUrl();

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

