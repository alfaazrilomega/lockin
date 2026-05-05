import type { Metadata } from 'next'
import AboutPageClient from '@/components/about/AboutPageClient'

export const metadata: Metadata = {
  title: 'About — Mino Creative Agency',
  description: 'Meet the team behind Mino. Art + Technology + Strategy for real estate.',
}

export default function AboutPage() {
  return <AboutPageClient />
}
