import { NextResponse } from 'next/server'

// Static team data — Prisma DB connection not configured in this environment
const TEAM_MEMBERS = [
  { id: '1', name: 'Diogo Ferreira', role: 'Founder & Creative Director', bio: 'Visionary leader with 10+ years in real estate marketing.', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&q=80', order: 1, isActive: true },
  { id: '2', name: 'Ana Martins', role: 'Head of Brand Design', bio: 'Award-winning brand designer specializing in luxury real estate.', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=500&fit=crop&q=80', order: 2, isActive: true },
  { id: '3', name: 'Marco Silva', role: '3D Lead Artist', bio: 'Mastering the art of photorealistic CGI for architectural visualization.', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&q=80', order: 3, isActive: true },
  { id: '4', name: 'Sofia Pereira', role: 'Film Director', bio: 'Creating cinematic stories that bring real estate projects to life.', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&q=80', order: 4, isActive: true },
]

export async function GET() {
  return NextResponse.json(TEAM_MEMBERS)
}
