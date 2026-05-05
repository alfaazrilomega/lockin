import type { Metadata } from 'next'
import ServicesPageClient from '@/components/services/ServicesPageClient'

export const metadata: Metadata = {
  title: 'Services — Mino',
  description: 'Brand identity, 3D imagery, film, immersive experiences, and website design for real estate.',
}

export default function ServicesPage() {
  return <ServicesPageClient />
}
