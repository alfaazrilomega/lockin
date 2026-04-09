import SmoothScrolling from '@/components/layout/SmoothScrolling'
import Navbar from "@/components/landing/navbar"
import ContactFormSection from "@/components/contact/contact-form-section"
import Footer from "@/components/landing/footer"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | LockIn',
  description: 'Have a bold idea? We combine design, motion, and development to create digital experiences. Contact our diverse engineering and support team today.',
  keywords: 'contact, support, team, engineering, design, help, get in touch',
}

export default function ContactPage() {
  return (
    <SmoothScrolling>
      <div className="relative w-full tracking-tight min-h-screen font-satoshi bg-[#F8F9FA]">
        
        {/* Contact Content Area (Top layer) */}
        <div id="main-content-layer" className="relative z-10 bg-[#F8F9FA] rounded-b-[3rem] md:rounded-b-[0] shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-h-screen flex flex-col">
          <Navbar delay={0} />
          
          <div className="flex-1 pt-24 lg:pt-0 flex items-center">
            <ContactFormSection />
          </div>
        </div>

        {/* Footer Parallax Area (Bottom layer, revealed on scroll) */}
        <div className="sticky bottom-0 w-full h-screen z-0 bg-[#1C1629]">
          <Footer />
        </div>

      </div>
    </SmoothScrolling>
  )
}
