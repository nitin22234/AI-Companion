import { NextResponse } from 'next/server';
import { Companion } from '@/types';

// Mock data for AI companions
const companions: Companion[] = [
  {
    id: '1',
    name: 'Alex',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    description: 'A friendly and knowledgeable tutor specializing in mathematics and science.',
    voiceId: 'voice_alex_001',
    personality: 'Encouraging and patient',
    specialties: ['Mathematics', 'Physics', 'Chemistry']
  },
  {
    id: '2',
    name: 'Sofia',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    description: 'An enthusiastic language teacher with expertise in multiple languages.',
    voiceId: 'voice_sofia_002',
    personality: 'Energetic and creative',
    specialties: ['English', 'Spanish', 'French', 'Literature']
  },
  {
    id: '3',
    name: 'Marcus',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    description: 'A history and social studies expert with a passion for storytelling.',
    voiceId: 'voice_marcus_003',
    personality: 'Wise and engaging',
    specialties: ['History', 'Social Studies', 'Geography', 'Political Science']
  },
  {
    id: '4',
    name: 'Luna',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    description: 'A tech-savvy coding instructor with expertise in modern programming languages.',
    voiceId: 'voice_luna_004',
    personality: 'Analytical and innovative',
    specialties: ['Programming', 'Computer Science', 'Web Development', 'Data Science']
  },
  {
    id: '5',
    name: 'Dr. Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    description: 'A medical professional and biology expert with extensive teaching experience.',
    voiceId: 'voice_chen_005',
    personality: 'Precise and caring',
    specialties: ['Biology', 'Medicine', 'Anatomy', 'Health Sciences']
  },
  {
    id: '6',
    name: 'Emma',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    description: 'An art and design instructor with a creative approach to learning.',
    voiceId: 'voice_emma_006',
    personality: 'Creative and inspiring',
    specialties: ['Art', 'Design', 'Photography', 'Creative Writing']
  }
];

export async function GET() {
  try {
    return NextResponse.json(companions);
  } catch (error) {
    console.error('Error fetching companions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companions' },
      { status: 500 }
    );
  }
}

