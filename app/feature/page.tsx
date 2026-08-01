import SmoothScrolling from '@/components/layout/SmoothScrolling'
import Footer from "@/components/landing/footer"
import FeatureHero from "@/components/feature/feature-hero"
import FeatureAccordion from "@/components/feature/interactive-accordion"
import ScrollRevealText from "@/components/feature/scroll-reveal-text"
import CoreValuesGallery from "@/components/feature/core-values-gallery"
import LottieFeatureShowcase from "@/components/feature/lottie-feature-showcase"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ecosystem & Features | LockIn',
  description: 'Supercharge your workflow depth with trusted integrations. LockIn connects with your favorite ecosystems to provide a seamless, uncompromised real estate experience.',
  keywords: 'features, integrations, workflow, ecosystem, seamless, partners',
}


export default function FeaturePage() {
  return (
    <SmoothScrolling>
      <div className="relative w-full tracking-tight font-satoshi bg-[#F8F9FA]">
        
        {/* Main Content Area (Top layer) */}
        <div id="main-content-layer" className="relative z-10 bg-white rounded-b-[3rem] md:rounded-b-[0] shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-h-screen flex flex-col">
          <FeatureHero />
          <ScrollRevealText text="We don't believe in walled gardens. LockIn is deeply integrated with the industry's most powerful native platforms to provide a seamless, uncompromised workflow across your entire ecosystem." />
          <FeatureAccordion />
          <LottieFeatureShowcase />
          <CoreValuesGallery />
        </div>

        {/* Footer Parallax Area (Bottom layer, revealed on scroll) */}
        <div className="sticky bottom-0 w-full h-screen z-0 bg-[#1C1629]">
          <Footer />
        </div>

      </div>
    </SmoothScrolling>
  )
}
