'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Companion } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Video, Users, BookOpen, Sparkles } from 'lucide-react';

export default function CompanionsPage() {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCompanions();
  }, []);

  const fetchCompanions = async () => {
    try {
      const response = await fetch('/api/companions');
      if (response.ok) {
        const data = await response.json();
        setCompanions(data);
      } else {
        console.error('Failed to fetch companions');
      }
    } catch (error) {
      console.error('Error fetching companions:', error);
    } finally {
      setLoading(false);
    }
  };

  const startVideoCall = (companion: Companion) => {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    router.push(`/call/${roomId}?companion=${encodeURIComponent(JSON.stringify(companion))}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI companions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-indigo-600" />
            AI Companion Video Calls
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your AI companion and start an interactive video learning session
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">{companions.length}</h3>
            <p className="text-gray-600">AI Companions</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Video className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">HD</h3>
            <p className="text-gray-600">Video Quality</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <BookOpen className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">24/7</h3>
            <p className="text-gray-600">Available</p>
          </div>
        </div>

        {/* Companions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companions.map((companion) => (
            <Card key={companion.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 border-4 border-indigo-100 group-hover:border-indigo-300 transition-colors">
                    <AvatarImage src={companion.avatarUrl} alt={companion.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {companion.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl text-gray-900">{companion.name}</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {companion.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Personality */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Personality</h4>
                  <p className="text-sm text-gray-600 italic">"{companion.personality}"</p>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {companion.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Call Button */}
                <Button
                  onClick={() => startVideoCall(companion)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors group-hover:shadow-lg"
                >
                  <Video className="h-5 w-5 mr-2" />
                  Start Video Call
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>Powered by advanced AI technology • Real-time video calls • Interactive learning</p>
        </div>
      </div>
    </div>
  );
}

