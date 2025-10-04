'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Companion, VideoCallMessage } from '@/types';
import VideoCallModal from '@/components/VideoCallModal';

export default function CallPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [callMessages, setCallMessages] = useState<VideoCallMessage[]>([]);

  const roomId = params.roomId as string;

  useEffect(() => {
    // Get companion data from URL parameters
    const companionParam = searchParams.get('companion');
    if (companionParam) {
      try {
        const companionData = JSON.parse(decodeURIComponent(companionParam));
        setCompanion(companionData);
      } catch (error) {
        console.error('Error parsing companion data:', error);
        router.push('/companions');
      }
    } else {
      router.push('/companions');
    }
    setIsLoading(false);
  }, [searchParams, router]);

  const handleCallEnd = (recordingBlob?: Blob) => {
    console.log('Call ended', { recordingBlob });
    // Here you could save the recording or call data
    router.push('/companions');
  };

  const handleMessage = (message: VideoCallMessage) => {
    setCallMessages(prev => [...prev, message]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Initializing video call...</p>
        </div>
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p>Companion not found. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <VideoCallModal
      roomId={roomId}
      userId="user_123" // In a real app, this would come from authentication
      companion={companion}
      onEnd={handleCallEnd}
      onMessage={handleMessage}
      captions={false}
    />
  );
}

