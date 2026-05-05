import type { Metadata } from 'next'
import CareersPageClient from '@/components/careers/CareersPageClient'

export const metadata: Metadata = {
  title: 'Careers — Mino',
  description: 'Join Mino. Work on ambitious real estate projects across Europe and the Middle East.',
}

export default function CareersPage() {
  return <CareersPageClient />
}
