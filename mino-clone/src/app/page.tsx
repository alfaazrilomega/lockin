import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import StatementSection from '@/components/home/StatementSection'
import ServicesSection from '@/components/home/ServicesSection'
import MissionSection from '@/components/home/MissionSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import BlogSection from '@/components/home/BlogSection'
import PricingSection from '@/components/home/PricingSection'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Mino — Creative Agency for Real Estate',
  description: 'What you build is beautiful. But is beauty enough? Full stories are.',
}

async function getData() {
  return { posts: [] as { slug: string; title: string; excerpt: string; category: string; publishedAt: string; coverImage: string }[] }
}

export default async function HomePage() {
  const { posts } = await getData()

  return (
    <>
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2+3: Pinned statement — black→gray transition with per-letter animations */}
      <StatementSection />

      {/* Section 4+: White background sections */}
      <ServicesSection />
      <MissionSection />
      <TestimonialsSection />
      <BlogSection posts={posts} />
      <PricingSection />
    </>
  )
}
