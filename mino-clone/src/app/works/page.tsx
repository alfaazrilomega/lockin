import type { Metadata } from 'next'
import WorksPageClient from '@/components/works/WorksPageClient'

export const metadata: Metadata = {
  title: 'Selected Works — Mino',
  description: 'Explore our selected portfolio of real estate visual storytelling projects across Europe and the Middle East.',
}

export default function WorksPage() {
  return <WorksPageClient />
}
