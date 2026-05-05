import { NextResponse } from 'next/server'

// Static blog data — Prisma DB connection not configured in this environment
const BLOG_POSTS = [
  {
    slug: 'nomad-eden-james-edition',
    title: 'Nomad Eden Featured on James Edition',
    excerpt: 'Nomad Eden has been featured by James Edition — a recognition that celebrates our team\'s vision and dedication.',
    category: 'Mino News',
    publishedAt: '2025-08-08T00:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=530&fit=crop&q=85',
  },
  {
    slug: 'mino-redesign-2025',
    title: "Mino's New Website: A Reflection of Who We Are",
    excerpt: 'We redesigned our website from the ground up — a new digital identity that better reflects the quality and vision we bring to every project.',
    category: 'Inside Mino',
    publishedAt: '2025-07-22T00:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=530&fit=crop&q=85',
  },
  {
    slug: 'real-estate-visual-storytelling',
    title: 'Why Visual Storytelling is the New Sales Force in Real Estate',
    excerpt: "The luxury real estate market has fundamentally changed. Buyers don't just buy property — they buy a vision.",
    category: 'Market Insights',
    publishedAt: '2025-06-05T00:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=530&fit=crop&q=85',
  },
]

export async function GET() {
  return NextResponse.json(BLOG_POSTS)
}
