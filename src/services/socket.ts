import { io, Socket } from 'socket.io-client';
import type { JobApplication, Job } from '../types';

// Socket URL - Always use Railway production URL
const SOCKET_URL = 'https://backend-nodejs-jobportal-production.up.railway.app';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    console.log('🔌 Connecting to Socket URL:', SOCKET_URL);

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

