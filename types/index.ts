export interface Companion {
  id: string;
  name: string;
  avatarUrl: string;
  description: string;
  voiceId: string;
  personality: string;
  specialties: string[];
}

export interface VideoCallMessage {
  from: 'user' | 'companion';
  text: string;
  timestamp: Date;
}

export interface VideoCallProps {
  roomId: string;
  userId: string;
  companion: Companion;
  onEnd: (recordingBlob?: Blob) => void;
  onMessage?: (msg: VideoCallMessage) => void;
  captions?: boolean;
}

export interface CallControls {
  isMuted: boolean;
  isVideoEnabled: boolean;
  isCaptionsEnabled: boolean;
  callStartTime: Date | null;
}

