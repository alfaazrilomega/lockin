import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/layout/CustomCursor'

export const metadata: Metadata = {
  title: 'Mino — Creative Agency for Real Estate',
  description: 'What you build is beautiful. But is beauty enough? Full stories are.',
  openGraph: {
    title: 'Mino — Creative Agency for Real Estate',
    description: 'What you build is beautiful. But is beauty enough? Full stories are.',
    url: 'https://mino.works',
    siteName: 'Mino',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <CustomCursor />
        <Navigation />
        <main style={{ background: '#FFFFFF' }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
