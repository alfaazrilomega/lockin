import SmoothScrolling from '@/components/layout/SmoothScrolling'
import AmritHero from "@/components/Hero/AmritHero"
import FeaturedSection from "@/components/landing/featured-section"
import WorkspaceSection from "@/components/landing/workspace-section"
import ContactSection from "@/components/landing/contact-section"
import ContentWrapper from "@/components/landing/content-wrapper"

/**
 * Root landing page — pure Server Component.
 *
 * Hydration architecture:
 *  - <SmoothScrolling>     → client boundary (ReactLenis needs browser APIs)
 *  - <AmritHero>           → "use client" (motion/react + useAuth)
 *  - <FeaturedSection>     → "use client" (useScroll Liquid Window engine)
 *  - <WorkspaceSection>    → "use client" (whileInView stagger grid)
 *  - <ContactSection>      → "use client" (magnetic button + useSpring)
 */
export default function Home() {
  return (
    <SmoothScrolling>
      <div className="relative w-full tracking-tight">

        {/* ─── Hero — natural scroll, no sticky hack ─── */}
        <div className="relative w-full z-50">
          <AmritHero />
        </div>

        {/* ─── Global Scroll Tracked Content ─── */}
        <ContentWrapper>
          {/* ─── Liquid Window + Featured Work Grid ─── */}
          <FeaturedSection />

          {/* ─── Workspace Capability Grid ─── */}
          <WorkspaceSection />

          {/* ─── Maximalist CTA + Footer ─── */}
          <ContactSection />
        </ContentWrapper>

      </div>
    </SmoothScrolling>
  )
}
