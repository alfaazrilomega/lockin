import type { Metadata } from 'next'
import BlogPageClient from '@/components/blog/BlogPageClient'

export const metadata: Metadata = {
  title: 'Blog — Mino',
  description: 'Mino News, Stories, Inside Mino, and Market Insights. Don\'t get FOMO.',
}

export default function BlogPage() {
  return <BlogPageClient />
}
