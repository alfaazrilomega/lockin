import SmoothScrolling from '@/components/layout/SmoothScrolling'
import AmritHero from "@/components/Hero/AmritHero"
import FeaturedSection from "@/components/landing/featured-section"
import ContactSection from "@/components/landing/contact-section"
import ContentWrapper from "@/components/landing/content-wrapper"
import Footer from "@/components/landing/footer"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LockIn | The Definitive Productivity Workspace',
  description: 'We bring together the intelligence of AI with high-performance management. Unlock your potential with our seamless ecosystem and zero-latency workflow.',
  keywords: 'productivity, workspace, management, enterprise, teamwork',
}


/**
 * Root landing page — pure Server Component.
 *
 * Hydration architecture:
 *  - <SmoothScrolling>     → client boundary (ReactLenis needs browser APIs)
 *  - <AmritHero>           → "use client" (motion/react + useAuth)
 *  - <FeaturedSection>     → "use client" (useScroll Liquid Window engine)
 *  - <ContactSection>      → "use client" (magnetic button + useSpring)
 */
export default function Home() {
  return (
    <SmoothScrolling>
      <div className="relative w-full tracking-tight bg-[#F8F9FA]">

        {/* Main Content Area (Top layer) */}
        <div id="main-content-layer" className="relative z-10 bg-background rounded-b-[3rem] md:rounded-b-[0] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col">
          {/* ─── Hero ─── */}
          <div className="relative w-full z-50">
            <AmritHero />
          </div>

          {/* ─── Global Scroll Tracked Content (FlowingThread lives here) ── */}
          <ContentWrapper>
            <FeaturedSection />
            <ContactSection />
          </ContentWrapper>
        </div>

        {/* Footer Parallax Area (Bottom layer, revealed on scroll) */}
        <div className="sticky bottom-0 w-full h-screen z-0 bg-[#1C1629]">
          <Footer />
        </div>

      </div>
    </SmoothScrolling>
  )
}
