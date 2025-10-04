'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VideoCallProps, VideoCallMessage, CallControls } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  MessageSquare,
  Settings,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function VideoCallModal({
  roomId,
  userId,
  companion,
  onEnd,
  onMessage,
  captions = false
}: VideoCallProps) {
  const [messages, setMessages] = useState<VideoCallMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controls, setControls] = useState<CallControls>({
    isMuted: false,
    isVideoEnabled: true,
    isCaptionsEnabled: captions,
    callStartTime: new Date()
  });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isCompanionSpeaking, setIsCompanionSpeaking] = useState(false);
  const [isCompanionThinking, setIsCompanionThinking] = useState(false);

  // Initialize call
  useEffect(() => {
    initializeCall();
    return () => {
      cleanup();
    };
  }, []);

  // Call timer
  useEffect(() => {
    if (controls.callStartTime) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - controls.callStartTime!.getTime()) / 1000));
      }, 1000);
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [controls.callStartTime]);

  // Auto-scroll chat messages
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebSocket connection
      initializeWebSocket();

      // Initialize peer connection
      initializePeerConnection();

      // Simulate companion joining after a delay
      setTimeout(() => {
        simulateCompanionJoin();
      }, 2000);

    } catch (error) {
      console.error('Error initializing call:', error);
    }
  };

  const initializeWebSocket = () => {
    // In a real implementation, you would connect to your WebSocket server
    // For now, we'll simulate the connection
    console.log('WebSocket connection established for room:', roomId);
  };

  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };

    peerConnectionRef.current = new RTCPeerConnection(configuration);

    // Add local stream to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle remote stream
    peerConnectionRef.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer via WebSocket
        console.log('ICE candidate:', event.candidate);
      }
    };
  };

  const simulateCompanionJoin = () => {
    // Create a simulated AI companion video stream
    createCompanionVideoStream();

    // Simulate companion joining message
    const companionMessage: VideoCallMessage = {
      from: 'companion',
      text: `Hello! I'm ${companion.name}. I'm excited to help you learn today. What would you like to explore?`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, companionMessage]);
    onMessage?.(companionMessage);

    // Show speaking indicator
    setIsCompanionSpeaking(true);
    setTimeout(() => setIsCompanionSpeaking(false), 3000);

    // Add periodic companion messages to keep the conversation alive
    setTimeout(() => {
      const periodicMessages = [
        "I'm here and ready to help! Feel free to ask me anything about my specialties.",
        "Don't hesitate to ask questions - that's how we learn best together!",
        "I'm enjoying our conversation! What would you like to explore next?",
        "Remember, there are no silly questions - every question is a step toward understanding!",
        "I'm here to support your learning journey. What interests you most right now?"
      ];

      const randomMessage = periodicMessages[Math.floor(Math.random() * periodicMessages.length)];
      const periodicCompanionMessage: VideoCallMessage = {
        from: 'companion',
        text: randomMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, periodicCompanionMessage]);
      onMessage?.(periodicCompanionMessage);

      setIsCompanionSpeaking(true);
      setTimeout(() => setIsCompanionSpeaking(false), 2000);
    }, 30000); // Send a periodic message every 30 seconds
  };

  const createCompanionVideoStream = () => {
    // Create a canvas to simulate AI companion video
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');

    // Draw background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw companion avatar
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw circular avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2 - 50, 80, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(img, canvas.width / 2 - 80, canvas.height / 2 - 130, 160, 160);
      ctx.restore();

      // Draw companion name
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(companion.name, canvas.width / 2, canvas.height / 2 + 80);

      // Draw "AI Companion" label
      ctx.font = '16px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText('AI Companion', canvas.width / 2, canvas.height / 2 + 110);

      // Draw status indicator
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(canvas.width / 2 + 100, canvas.height / 2 - 100, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Create stream from canvas
      const stream = canvas.captureStream(30); // 30 FPS
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };

    img.src = companion.avatarUrl;
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setControls(prev => ({ ...prev, isMuted: !prev.isMuted }));
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setControls(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
      }
    }
  };

  const toggleCaptions = () => {
    setControls(prev => ({ ...prev, isCaptionsEnabled: !prev.isCaptionsEnabled }));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: VideoCallMessage = {
        from: 'user',
        text: newMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      onMessage?.(userMessage);
      setNewMessage('');

      // Show thinking indicator
      setIsCompanionThinking(true);

      // Simulate companion response with more contextual and engaging responses
      setTimeout(() => {
        setIsCompanionThinking(false);
        const responses = [
          `That's a fantastic question! As your ${companion.specialties[0]} tutor, I'd love to help you understand this better. Let me break it down for you...`,
          `I'm excited you're thinking about this topic! In my experience with ${companion.specialties.join(' and ')}, this is a key concept that connects to many other ideas.`,
          `Great question! You know, ${companion.name} here - I specialize in ${companion.specialties.slice(0, 2).join(' and ')}, so I can definitely help you explore this further.`,
          `I appreciate your curiosity! This is exactly the kind of thinking that leads to deeper understanding. Let me share some insights from ${companion.specialties[0]}...`,
          `Wonderful! You're asking the right questions. As an AI companion focused on ${companion.specialties.join(', ')}, I'm here to guide you through this step by step.`,
          `That's a thoughtful approach! I love how you're connecting ideas. In ${companion.specialties[0]}, we often see this pattern, and here's why it matters...`,
          `Excellent! You're developing critical thinking skills. Let me explain this concept in a way that builds on what you already know about ${companion.specialties[0]}.`,
          `I'm impressed by your question! This shows you're really engaging with the material. Let me walk you through this ${companion.specialties[0]} concept...`
        ];

        const companionResponse: VideoCallMessage = {
          from: 'companion',
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, companionResponse]);
        onMessage?.(companionResponse);

        // Show speaking indicator
        setIsCompanionSpeaking(true);
        setTimeout(() => setIsCompanionSpeaking(false), 4000);
      }, 1500 + Math.random() * 3000);
    }
  };

  const endCall = () => {
    cleanup();
    onEnd();
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    if (socketRef.current) {
      socketRef.current.close();
    }

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/80 text-white">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={companion.avatarUrl} alt={companion.name} />
              <AvatarFallback>{companion.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{companion.name}</h3>
              <p className="text-sm text-gray-300">{formatDuration(callDuration)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(!showChat)}
              className="text-white hover:bg-white/20"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex relative">
          {/* Video Area */}
          <div className="flex-1 relative bg-gray-900">
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* AI Speaking Indicator */}
            {isCompanionSpeaking && (
              <div className="absolute bottom-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 animate-pulse">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm font-medium">{companion.name} is speaking...</span>
              </div>
            )}

            {/* AI Thinking Indicator */}
            {isCompanionThinking && (
              <div className="absolute bottom-4 left-4 bg-yellow-600 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm font-medium">{companion.name} is thinking...</span>
              </div>
            )}

            {/* Local Video */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </div>

            {/* Captions */}
            {controls.isCaptionsEnabled && (
              <div className="absolute bottom-20 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
                <p className="text-center">AI Companion is speaking...</p>
              </div>
            )}
          </div>

          {/* Chat Panel */}
          {showChat && (
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold">Chat</h3>
              </div>

              <div
                ref={chatMessagesRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${message.from === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                        }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Button onClick={sendMessage} size="sm">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 p-6 bg-black/80">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className={`text-white hover:bg-white/20 ${controls.isMuted ? 'bg-red-600' : ''}`}
          >
            {controls.isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVideo}
            className={`text-white hover:bg-white/20 ${!controls.isVideoEnabled ? 'bg-red-600' : ''}`}
          >
            {controls.isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCaptions}
            className={`text-white hover:bg-white/20 ${controls.isCaptionsEnabled ? 'bg-indigo-600' : ''}`}
          >
            <Volume2 className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
